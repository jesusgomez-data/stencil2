import numpy as np, cv2, subprocess, sys, math

W, H, FPS = 1920, 1080, 24
DUR = 15.0
N = int(DUR * FPS)
OUT = sys.argv[1] if len(sys.argv) > 1 else "draft.mp4"
PREVIEW = "--preview" in sys.argv
rng = np.random.default_rng(7)

def load(p):
    im = cv2.imread(p, cv2.IMREAD_COLOR).astype(np.float32) / 255.0
    h, w = im.shape[:2]
    f = 140
    yy = np.minimum(np.arange(h), np.arange(h)[::-1])[:, None]
    xx = np.minimum(np.arange(w), np.arange(w)[::-1])[None, :]
    m = np.clip(np.minimum(yy, xx) / f, 0, 1)
    m = (m * m * (3 - 2 * m)).astype(np.float32)
    # clean backdrop plate: interpolate the photo's own border inward (no glasses), so the canvas
    # around the photo continues the same studio backdrop instead of hard black
    sw, sh = 96, 64
    small = cv2.resize(im, (sw, sh), interpolation=cv2.INTER_AREA)
    s8 = (small * 255).astype(np.uint8)
    mask = np.full((sh, sw), 255, np.uint8); mask[:3, :] = 0; mask[-3:, :] = 0; mask[:, :3] = 0; mask[:, -3:] = 0
    plate = cv2.inpaint(s8, mask, 20, cv2.INPAINT_TELEA).astype(np.float32) / 255.0
    plate = cv2.GaussianBlur(cv2.resize(plate, (w, h), interpolation=cv2.INTER_CUBIC), (0, 0), 40)
    return im, m, plate

SRC = {k: load(f"{k}.png") for k in ["A_front", "B_34", "C_sideR", "D_sideL", "E_macro"]}

def ease(t):  # easeInOutCubic
    t = min(max(t, 0), 1)
    return 4 * t ** 3 if t < .5 else 1 - (-2 * t + 2) ** 3 / 2

def lerp(a, b, t): return a + (b - a) * t

def place(src, scale, cx, cy, dx=0, dy=0):
    """Map source point (cx,cy) to canvas center + (dx,dy) at given scale."""
    img, m, plate = src
    M = np.float32([[scale, 0, W / 2 + dx - cx * scale], [0, scale, H / 2 + dy - cy * scale]])
    a = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    mm = cv2.warpAffine(m, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)[..., None]
    bg = cv2.warpAffine(plate, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    return a * mm + bg * (1 - mm)

# shots: (key, t0, t1, scale0, scale1, (cx,cy) src focus, dx0, dx1, dy0, dy1)
SHOTS = [
    ("A_front", 0.0, 2.7, 1.02, 1.13, (768, 500), 0, 0, 20, -10),
    ("B_34",    2.7, 5.1, 1.10, 1.20, (760, 520), 140, -60, 0, 0),
    ("C_sideR", 5.1, 7.1, 1.12, 1.22, (760, 470), 160, -80, 0, 0),
    ("D_sideL", 7.1, 9.0, 1.12, 1.22, (760, 470), 160, -80, 0, 0),
    ("E_macro", 9.0, 11.6, 1.26, 1.48, (860, 450), 60, -20, 0, 0),
]
# light sweeps: (shot key, start, end, angle deg, width px, strength)
SWEEPS = [("A_front", 0.7, 2.3, 70, 260, 1.1), ("B_34", 3.1, 4.8, 60, 240, 1.2),
          ("C_sideR", 5.4, 6.9, 75, 220, 1.1), ("D_sideL", 7.3, 8.8, 105, 220, 1.1),
          ("E_macro", 9.8, 11.3, 65, 200, 1.0)]
WHIP = 0.22  # half-duration of whip transitions (s)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
vign = 1 - 0.55 * np.clip(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H / 2) / (H * 0.70)) ** 2, 0, 1)
vign = vign[..., None]

def sweep_band(p, ang, width):
    a = math.radians(ang)
    d = xx * math.cos(a) + yy * math.sin(a)
    return np.exp(-((d - p) / width) ** 2)[..., None]

def apply_sweep(fr, key, t):
    for k, s0, s1, ang, wd, st in SWEEPS:
        if k == key and s0 <= t <= s1:
            u = ease((t - s0) / (s1 - s0))
            a = math.radians(ang)
            span = W * abs(math.cos(a)) + H * abs(math.sin(a))
            lo = min(0, W * math.cos(a)) + min(0, H * math.sin(a)) - wd * 2
            p = lerp(lo, lo + span + wd * 4, u)
            b = sweep_band(p, ang, wd)
            # light only lifts what is already lit (acetate flecks, edges), black stays black
            fr = fr * (1 + st * b) + 0.05 * b * fr.mean(axis=2, keepdims=True) * np.float32([0.7, 0.85, 1.0])
    return fr

def render_shot(i, t, extra_dx=0.0):
    key, t0, t1, s0, s1, (cx, cy), dx0, dx1, dy0, dy1 = SHOTS[i]
    u = (t - t0) / (t1 - t0)
    ue = lerp(u, ease(u), 0.35)  # mostly linear drift, slightly eased
    s = lerp(s0, s1, ue)
    fr = place(SRC[key], s, cx, cy, lerp(dx0, dx1, ue) + extra_dx, lerp(dy0, dy1, ue))
    return apply_sweep(fr, key, t)

def motion_blur(fr, k):
    k = int(k)
    if k < 3: return fr
    return cv2.blur(fr, (k, 1))

# dust particles (warm bokeh)
NP = 70
P = dict(x=rng.uniform(0, W, NP), y=rng.uniform(0, H, NP), z=rng.uniform(0.2, 1, NP),
         vx=rng.uniform(-8, 8, NP), vy=rng.uniform(-14, -3, NP), ph=rng.uniform(0, 6.28, NP))
def particles(t, strength=1.0):
    layer = np.zeros((H // 2, W // 2), np.float32)
    for j in range(NP):
        z = P["z"][j]
        x = (P["x"][j] + P["vx"][j] * t * (0.5 + z)) % W
        y = (P["y"][j] + P["vy"][j] * t * (0.5 + z)) % H
        a = (0.25 + 0.75 * (0.5 + 0.5 * math.sin(t * 1.3 + P["ph"][j]))) * (0.15 + 0.5 * z)
        cv2.circle(layer, (int(x / 2), int(y / 2)), max(1, int(1 + 2.5 * z)), a, -1, cv2.LINE_AA)
    layer = cv2.GaussianBlur(layer, (0, 0), 1.6)
    layer = cv2.resize(layer, (W, H), interpolation=cv2.INTER_LINEAR)[..., None]
    return layer * np.float32([0.45, 0.72, 1.0]) * 0.22 * strength  # BGR warm gold

# ---------- logo end card ----------
logo = cv2.imread("logo.png", cv2.IMREAD_UNCHANGED)
x0, y0, x1, y1 = 442, 344, 2118, 3014
la = logo[y0:y1, x0:x1, 3].astype(np.float32) / 255.0
LH = 500
LW = int(la.shape[1] * LH / la.shape[0])
la = cv2.resize(la, (LW, LH), interpolation=cv2.INTER_AREA)
scr = cv2.imread("logo-script-white.png", cv2.IMREAD_UNCHANGED)[6:228, 2:457, 3].astype(np.float32) / 255.0
SW = 420
SH = int(scr.shape[0] * SW / scr.shape[1])
scr = cv2.resize(scr, (SW, SH), interpolation=cv2.INTER_AREA)

GX, GY = (W - LW) // 2, 150
SX, SY = (W - SW) // 2, GY + LH + 40
G = np.zeros((H, W), np.float32); G[GY:GY + LH, GX:GX + LW] = la
S = np.zeros((H, W), np.float32); S[SY:SY + SH, SX:SX + SW] = scr
# spray-stencil noise field for the reveal
def fbm(shape, scales, seed):
    r = np.random.default_rng(seed); acc = np.zeros(shape, np.float32)
    for sc, amp in scales:
        n = r.random((shape[0] // sc + 2, shape[1] // sc + 2)).astype(np.float32)
        acc += amp * cv2.resize(n, (shape[1], shape[0]), interpolation=cv2.INTER_CUBIC)
    return (acc - acc.min()) / (acc.max() - acc.min())
NOISE = fbm((H, W), [(64, 0.5), (16, 0.3), (3, 0.2)], 3)
ynorm = 1 - (yy - GY) / LH  # 0 at bottom of grenade, 1 at top
REVEAL_FIELD = np.clip(ynorm, 0, 1) * 0.65 + NOISE * 0.35
GOLD = np.float32([0.35, 0.68, 1.0])  # BGR

def logo_card(t):
    """t: seconds since card start."""
    fr = np.zeros((H, W, 3), np.float32)
    # grenade: spray reveal 0.0 -> 1.3s
    p = ease(t / 1.3) * 1.25 - 0.1
    rev = np.clip((p - REVEAL_FIELD) / 0.08, 0, 1)
    g = G * rev
    mist = cv2.GaussianBlur(G * np.clip((p + 0.08 - REVEAL_FIELD) / 0.15, 0, 1), (0, 0), 9) * (1 - ease((t - 1.0) / 0.8)) * 0.5
    fr += (g * 0.92)[..., None] + mist[..., None] * GOLD * 0.6
    # warm bloom behind the logo
    glow = cv2.GaussianBlur(g, (0, 0), 40) * 0.16
    fr += glow[..., None] * GOLD
    # light sweep over the grenade 1.5 -> 2.4s
    if 1.4 < t < 2.6:
        u = ease((t - 1.4) / 1.2)
        b = sweep_band(lerp(GX - 300, GX + LW + 900, u), 65, 90)[..., 0]
        fr += (cv2.GaussianBlur(b * g, (0, 0), 18) * 0.22)[..., None] * GOLD
    # script write-on wipe 1.3 -> 2.3s
    q = ease((t - 1.3) / 1.0)
    edge = SX - 60 + (SW + 120) * q
    wipe = np.clip((edge - xx) / 60, 0, 1)
    s = S * wipe
    blur_amt = (1 - q) * 4
    if blur_amt > 0.3: s = cv2.GaussianBlur(s, (0, 0), blur_amt)
    fr += (s * 0.96)[..., None] + cv2.GaussianBlur(s, (0, 0), 14)[..., None] * GOLD * 0.12
    # slow breathing scale for life
    sc = 1.0 + 0.025 * ease(t / 3.6)
    M = cv2.getRotationMatrix2D((W / 2, H / 2), 0, sc)
    return cv2.warpAffine(fr, M, (W, H), flags=cv2.INTER_LINEAR)

LOGO_T0 = 11.45

def frame(t):
    # which shot / transitions
    fr = None
    for i, sh in enumerate(SHOTS[:-1]):
        b = sh[2]
        if abs(t - b) < WHIP and i < 3:  # whip pan between angle shots
            u = (t - (b - WHIP)) / (2 * WHIP)  # 0..1
            vel = math.sin(math.pi * u)
            push = -900 * ease(u)
            if u < 0.5:
                f = render_shot(i, min(t, b - 1e-3), push)
            else:
                f = render_shot(i + 1, max(t, b), push + 900)
            fr = motion_blur(f, 4 + 260 * vel)
            # brief exposure lift at the cut
            fr = fr * (1 + 0.35 * vel)
            break
    if fr is None:
        if t < SHOTS[4][1] - 0.35:
            i = max(j for j, sh in enumerate(SHOTS) if sh[1] <= t)
            i = min(i, 3)
            fr = render_shot(i, t)
        elif t < SHOTS[4][1] + 0.35:  # rack-focus dissolve D -> macro
            u = ease((t - (SHOTS[4][1] - 0.35)) / 0.7)
            a = render_shot(3, min(t, SHOTS[3][2] - 1e-3))
            bb = render_shot(4, max(t, SHOTS[4][1]))
            a = cv2.GaussianBlur(a, (0, 0), 1 + 14 * u)
            bb = cv2.GaussianBlur(bb, (0, 0), 1 + 14 * (1 - u))
            fr = a * (1 - u) + bb * u
        elif t < LOGO_T0:
            fr = render_shot(4, min(t, SHOTS[4][2]))
            if t < SHOTS[4][1] + 0.9:
                bl = 6 * (1 - ease((t - SHOTS[4][1] - 0.35) / 0.55))
                if bl > 0.3: fr = cv2.GaussianBlur(fr, (0, 0), bl)
            # fade macro to black
            fr = fr * (1 - ease((t - (LOGO_T0 - 0.55)) / 0.55))
        else:
            fr = logo_card(t - LOGO_T0)
    # global: fade in / fade out (loop-friendly), particles, vignette, grain
    fin = ease(t / 0.6)
    fout = 1 - ease((t - (DUR - 0.6)) / 0.6)
    pstr = 1.0 if t < LOGO_T0 else 0.6
    fr = fr + particles(t, pstr)
    fr = fr * vign * fin * fout
    fr = fr + rng.normal(0, 0.006, (H, W, 1)).astype(np.float32) * fin * fout
    return np.clip(fr, 0, 1)

if PREVIEW:
    times = [float(x) for x in sys.argv[sys.argv.index("--preview") + 1].split(",")]
    for tt in times:
        cv2.imwrite(f"prev_{tt:05.2f}.jpg", (frame(tt) * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 88])
    sys.exit()

ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                       "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT],
                      stdin=subprocess.PIPE)
for n in range(N):
    ff.stdin.write((frame(n / FPS) * 255 + 0.5).astype(np.uint8).tobytes())
    if n % 48 == 0: print(n, flush=True)
ff.stdin.close(); ff.wait()
print("done")
