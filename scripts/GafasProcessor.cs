using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public static class GafasProcessor
{
    // Procesa una foto de estudio (producto sobre fondo claro) y la compone sobre un
    // fondo oscuro premium: glow radial sutil + sombra de contacto + producto recortado
    // con matting y descontaminacion de color (sin halos blancos).
    public static string Process(string input, string output, int maxWidth, double ratio, double fill)
    {
        using (var src = new Bitmap(input))
        {
            // 1) Redimensionar
            double scale = Math.Min(1.0, (double)maxWidth / src.Width);
            int w = Math.Max(1, (int)Math.Round(src.Width * scale));
            int h = Math.Max(1, (int)Math.Round(src.Height * scale));
            using (var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb))
            {
                using (var g = Graphics.FromImage(bmp))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.CompositingQuality = CompositingQuality.HighQuality;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.DrawImage(src, 0, 0, w, h);
                }

                var rect = new Rectangle(0, 0, w, h);
                var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int stride = data.Stride;
                int n = stride * h;
                byte[] px = new byte[n];
                Marshal.Copy(data.Scan0, px, 0, n);
                bmp.UnlockBits(data);

                Func<int,int,int> IIdx = delegate(int x, int y) { return y * stride + x * 4; };
                Func<byte,byte,byte,byte,byte,byte,double> Dist = delegate(byte r1, byte g1, byte b1, byte r2, byte g2, byte b2)
                {
                    double dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
                    return Math.Sqrt(dr * dr + dg * dg + db * db);
                };

                // 2) Color de fondo: media de pixeles CLAROS del borde
                double sr = 0, sg = 0, sb = 0; int cnt = 0;
                int step = Math.Max(1, w / 80);
                for (int x = 0; x < w; x += step)
                {
                    int i0 = IIdx(x, 0), i1 = IIdx(x, h - 1);
                    double l0 = 0.299 * px[i0 + 2] + 0.587 * px[i0 + 1] + 0.114 * px[i0];
                    double l1 = 0.299 * px[i1 + 2] + 0.587 * px[i1 + 1] + 0.114 * px[i1];
                    if (l0 > 170) { sr += px[i0 + 2]; sg += px[i0 + 1]; sb += px[i0]; cnt++; }
                    if (l1 > 170) { sr += px[i1 + 2]; sg += px[i1 + 1]; sb += px[i1]; cnt++; }
                }
                for (int y = 0; y < h; y += step)
                {
                    int i0 = IIdx(0, y), i1 = IIdx(w - 1, y);
                    double l0 = 0.299 * px[i0 + 2] + 0.587 * px[i0 + 1] + 0.114 * px[i0];
                    double l1 = 0.299 * px[i1 + 2] + 0.587 * px[i1 + 1] + 0.114 * px[i1];
                    if (l0 > 170) { sr += px[i0 + 2]; sg += px[i0 + 1]; sb += px[i0]; cnt++; }
                    if (l1 > 170) { sr += px[i1 + 2]; sg += px[i1 + 1]; sb += px[i1]; cnt++; }
                }
                byte br = (byte)(sr / cnt), bg2 = (byte)(sg / cnt), bb = (byte)(sb / cnt);

                // 3) Flood-fill del fondo desde los bordes: pixel es fondo si es claro
                //    (luminancia alta, incluye la sombra suave del estudio) o muy proximo
                //    al color de fondo. El producto (oscuro) bloquea la propagacion, y los
                //    reflejos de lente (dentro del producto, no conectados al borde) se
                //    conservan.
                bool[] isBg = new bool[w * h];
                var queue = new Queue<int>();
                double lumThr = 150.0;
                double colThr = 55.0;
                Action<int,int> Seed = null;
                Seed = delegate(int x, int y)
                {
                    int idx = y * w + x;
                    if (isBg[idx]) return;
                    int i = IIdx(x, y);
                    double lum = 0.299 * px[i + 2] + 0.587 * px[i + 1] + 0.114 * px[i];
                    if (lum > lumThr || Dist(px[i + 2], px[i + 1], px[i], br, bg2, bb) < colThr)
                    { isBg[idx] = true; queue.Enqueue(idx); }
                };
                Action<int,int> Try = null;
                Try = delegate(int x, int y)
                {
                    int idx = y * w + x;
                    if (isBg[idx]) return;
                    int i = IIdx(x, y);
                    double lum = 0.299 * px[i + 2] + 0.587 * px[i + 1] + 0.114 * px[i];
                    if (lum > lumThr || Dist(px[i + 2], px[i + 1], px[i], br, bg2, bb) < colThr)
                    { isBg[idx] = true; queue.Enqueue(idx); }
                };
                for (int x = 0; x < w; x++) { Seed(x, 0); Seed(x, h - 1); }
                for (int y = 0; y < h; y++) { Seed(0, y); Seed(w - 1, y); }
                while (queue.Count > 0)
                {
                    int idx = queue.Dequeue();
                    int cx = idx % w, cy = idx / w;
                    if (cx > 0) Try(cx - 1, cy);
                    if (cx < w - 1) Try(cx + 1, cy);
                    if (cy > 0) Try(cx, cy - 1);
                    if (cy < h - 1) Try(cx, cy + 1);
                }

                // 4) Relleno de huecos internos grandes (entre patilla y montura, puente)
                int holeMin = Math.Max(400, (w * h) / 800);
                bool[] cand = new bool[w * h];
                for (int y = 0; y < h; y++)
                    for (int x = 0; x < w; x++)
                    {
                        int idx = y * w + x;
                        int i = IIdx(x, y);
                        if (Dist(px[i + 2], px[i + 1], px[i], br, bg2, bb) < colThr * 1.8) cand[idx] = true;
                    }
                for (int y = 0; y < h; y++)
                    for (int x = 0; x < w; x++)
                        if (isBg[y * w + x]) cand[y * w + x] = false;
                bool[] vis = new bool[w * h];
                var stack = new Stack<int>();
                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        int idx = y * w + x;
                        if (!cand[idx] || vis[idx]) continue;
                        var comp = new List<int>();
                        stack.Push(idx); vis[idx] = true;
                        bool touches = (x == 0 || x == w - 1 || y == 0 || y == h - 1);
                        while (stack.Count > 0)
                        {
                            int c = stack.Pop(); comp.Add(c);
                            int cx = c % w, cy = c / w;
                            if (cx == 0 || cx == w - 1 || cy == 0 || cy == h - 1) touches = true;
                            if (cx > 0 && cand[c - 1] && !vis[c - 1]) { vis[c - 1] = true; stack.Push(c - 1); }
                            if (cx < w - 1 && cand[c + 1] && !vis[c + 1]) { vis[c + 1] = true; stack.Push(c + 1); }
                            if (cy > 0 && cand[c - w] && !vis[c - w]) { vis[c - w] = true; stack.Push(c - w); }
                            if (cy < h - 1 && cand[c + w] && !vis[c + w]) { vis[c + w] = true; stack.Push(c + w); }
                        }
                        if (!touches && comp.Count >= holeMin)
                            foreach (int c in comp) isBg[c] = true;
                    }
                }

                // 5) Matting + feathering + descontaminacion de color (elimina fringe blanco)
                //    El fringe es la mezcla producto+fondo blanco en el borde (lum ~150-180,
                //    distancia al fondo ~70-100). Se elimina con feathering amplio (radio 2)
                //    y descontaminacion: fg = (c - (1-a)*bg)/a.
                double dLow = 30.0, dHigh = 112.0;
                byte[] outPx = new byte[n];
                Array.Copy(px, outPx, n);
                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        int idx = y * w + x;
                        int i = IIdx(x, y);
                        byte r = px[i + 2], g = px[i + 1], b = px[i];
                        if (isBg[idx]) { outPx[i + 3] = 0; continue; }

                        double d = Dist(r, g, b, br, bg2, bb);

                        // cerca del fondo en radio 2 (captura fringe de varios px)
                        bool nearBg = false;
                        for (int dy = -2; dy <= 2 && !nearBg; dy++)
                        {
                            for (int dx = -2; dx <= 2 && !nearBg; dx++)
                            {
                                int nx = x + dx, ny = y + dy;
                                if (nx >= 0 && nx < w && ny >= 0 && ny < h && isBg[ny * w + nx]) nearBg = true;
                            }
                        }

                        double a = 1.0;
                        if (nearBg)
                        {
                            if (d < dLow) a = 0.0;
                            else if (d < dHigh) a = (d - dLow) / (dHigh - dLow);
                        }
                        int ai = (int)Math.Round(Math.Max(0, Math.Min(1, a)) * 255);
                        outPx[i + 3] = (byte)ai;
                        if (ai < 255)
                        {
                            // fg = (c - (1-a)*bg) / a : elimina el tinte claro del fondo
                            double af = ai / 255.0;
                            if (af < 0.03) { outPx[i + 2] = 0; outPx[i + 1] = 0; outPx[i] = 0; }
                            else
                            {
                                outPx[i + 2] = (byte)Math.Max(0, Math.Min(255, Math.Round((r - (1 - af) * br) / af)));
                                outPx[i + 1] = (byte)Math.Max(0, Math.Min(255, Math.Round((g - (1 - af) * bg2) / af)));
                                outPx[i]     = (byte)Math.Max(0, Math.Min(255, Math.Round((b - (1 - af) * bb) / af)));
                            }
                        }
                    }
                }

                // 6) Despeckle: eliminar componentes opacos pequenos aislados
                int speckMin = Math.Max(40, (w * h) / 3500);
                bool[] seen = new bool[w * h];
                var st2 = new Stack<int>();
                for (int y = 0; y < h; y++)
                {
                    for (int x = 0; x < w; x++)
                    {
                        int idx = y * w + x;
                        if (seen[idx] || outPx[IIdx(x, y) + 3] == 0) continue;
                        var comp = new List<int>();
                        st2.Push(idx); seen[idx] = true;
                        while (st2.Count > 0)
                        {
                            int c = st2.Pop(); comp.Add(c);
                            int cx = c % w, cy = c / w;
                            if (cx > 0 && !seen[c - 1] && outPx[IIdx(cx - 1, cy) + 3] > 0) { seen[c - 1] = true; st2.Push(c - 1); }
                            if (cx < w - 1 && !seen[c + 1] && outPx[IIdx(cx + 1, cy) + 3] > 0) { seen[c + 1] = true; st2.Push(c + 1); }
                            if (cy > 0 && !seen[c - w] && outPx[IIdx(cx, cy - 1) + 3] > 0) { seen[c - w] = true; st2.Push(c - w); }
                            if (cy < h - 1 && !seen[c + w] && outPx[IIdx(cx, cy + 1) + 3] > 0) { seen[c + w] = true; st2.Push(c + w); }
                        }
                        if (comp.Count < speckMin)
                            foreach (int c in comp)
                            {
                                int cx2 = c % w, cy2 = c / w;
                                int ii = IIdx(cx2, cy2);
                                outPx[ii + 3] = 0; outPx[ii + 2] = 0; outPx[ii + 1] = 0; outPx[ii] = 0;
                            }
                    }
                }

                // 7) Bounding box del producto
                int minX = w, minY = h, maxX = -1, maxY = -1;
                for (int y = 0; y < h; y++)
                    for (int x = 0; x < w; x++)
                        if (outPx[IIdx(x, y) + 3] > 12)
                        {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                if (maxX < 0) throw new Exception("No se detecto producto.");
                int cw = maxX - minX + 1, ch = maxY - minY + 1;

                // construir Bitmap del producto recortado
                Bitmap product;
                using (var p = new Bitmap(cw, ch, PixelFormat.Format32bppArgb))
                {
                    var prect = new Rectangle(0, 0, cw, ch);
                    var pdata = p.LockBits(prect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                    int pstride = pdata.Stride;
                    byte[] ppx = new byte[pstride * ch];
                    for (int y = 0; y < ch; y++)
                    {
                        int srcRow = (minY + y) * stride + minX * 4;
                        Array.Copy(outPx, srcRow, ppx, y * pstride, cw * 4);
                    }
                    Marshal.Copy(ppx, 0, pdata.Scan0, ppx.Length);
                    p.UnlockBits(pdata);
                    product = new Bitmap(p);
                }

                // 8) Componer sobre fondo oscuro premium HORNEADO (opaco), con control
                //    manual por pixel para un resultado determinista:
                //    vignette radial #0E0E0E -> #050505 + glow suave detras del producto
                //    + sombra de contacto + producto recortado limpio.
                int canvasW = maxWidth;
                int canvasH = (int)Math.Round(canvasW / ratio);
                double sc = Math.Min((canvasW * fill) / cw, (canvasH * 0.74) / ch);
                int pw = (int)Math.Round(cw * sc);
                int ph = (int)Math.Round(ch * sc);
                int ox = (canvasW - pw) / 2;
                int oy = (int)Math.Round((canvasH - ph) * 0.44);
                float gcx = canvasW / 2f;
                float gcy = oy + ph * 0.5f;
                float gr = Math.Max(pw, ph) * 1.15f;

                using (var canvas = new Bitmap(canvasW, canvasH, PixelFormat.Format32bppArgb))
                {
                    var crect = new Rectangle(0, 0, canvasW, canvasH);
                    var cdata = canvas.LockBits(crect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                    int cstride = cdata.Stride;
                    byte[] cp = new byte[cstride * canvasH];

                    // precomputar alfa de la sombra de contacto (elipse con borde suave)
                    float shW = pw * 0.82f;
                    float shH = ph * 0.10f;
                    float shCX = ox + pw * 0.5f;
                    float shCY = oy + ph - ph * 0.01f;

                    for (int y = 0; y < canvasH; y++)
                    {
                        for (int x = 0; x < canvasW; x++)
                        {
                            // vignette: distancia normalizada al centro del lienzo
                            double dx = (x - canvasW / 2.0) / (canvasW / 2.0);
                            double dy = (y - canvasH / 2.0) / (canvasH / 2.0);
                            double d = Math.Sqrt(dx * dx + dy * dy);
                            if (d > 1.0) d = 1.0;
                            double vig = 1.0 - d;
                            int baseV = (int)Math.Round(14.0 * vig + 4.0); // 14 -> 4

                            // glow detras del producto (blanco calido muy tenue)
                            double gx = (x - gcx) / gr;
                            double gy = (y - gcy) / gr;
                            double gd = Math.Sqrt(gx * gx + gy * gy);
                            int glowA = 0;
                            if (gd < 1.0) glowA = (int)Math.Round(30.0 * (1.0 - gd) * (1.0 - gd));

                            // sombra de contacto (negra, solo oscurece)
                            double sx = (x - shCX) / (shW * 0.5);
                            double sy = (y - shCY) / (shH * 0.5);
                            double sd = Math.Sqrt(sx * sx + sy * sy);
                            int shadowA = 0;
                            if (sd < 1.0) shadowA = (int)Math.Round(58.0 * (1.0 - sd) * (1.0 - sd));

                            int r = baseV, g2 = baseV, b = baseV;
                            // glow suma blanco
                            r += (int)(glowA * 0.30); g2 += (int)(glowA * 0.30); b += (int)(glowA * 0.30);
                            // sombra resta
                            r -= (int)(shadowA * 0.30); g2 -= (int)(shadowA * 0.30); b -= (int)(shadowA * 0.30);
                            if (r < 0) r = 0; if (g2 < 0) g2 = 0; if (b < 0) b = 0;
                            if (r > 255) r = 255; if (g2 > 255) g2 = 255; if (b > 255) b = 255;

                            int ci = y * cstride + x * 4;
                            cp[ci + 2] = (byte)r; cp[ci + 1] = (byte)g2; cp[ci] = (byte)b; cp[ci + 3] = 255;
                        }
                    }
                    Marshal.Copy(cp, 0, cdata.Scan0, cp.Length);
                    canvas.UnlockBits(cdata);

                    using (var g = Graphics.FromImage(canvas))
                    {
                        g.SmoothingMode = SmoothingMode.HighQuality;
                        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        g.CompositingQuality = CompositingQuality.HighQuality;
                        g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        g.DrawImage(product, ox, oy, pw, ph);
                    }
                    canvas.Save(output, ImageFormat.Png);
                }

                product.Dispose();
                return string.Format("{0}x{1} producto {2}x{3} -> lienzo {4}x{5}", w, h, cw, ch, canvasW, canvasH);
            }
        }
    }
}
