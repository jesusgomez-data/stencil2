// STENCIL2 — Hero cinematográfico (After Effects 2026)
// Monta la escena completa: pared, arco de neón, logo neón, podio, gafas originales recortadas,
// cámara 3D con DOF, transiciones whip, macro con rack focus y cierre con logo animado.
// Ejecutar: File > Scripts > Run Script File...  (los recursos van en ./assets junto a este .jsx)

(function () {
    app.beginUndoGroup("STENCIL2 Hero");
    var base = new File($.fileName).parent;
    var A = base.fullName + "/assets/";
    var W = 1920, H = 1080, FPS = 24, DUR = 15;
    var CX = 960;
    var FLOOR_Y = 1065, TOP_Y = 700, GZ = -40;      // podium top / glasses contact plane
    var proj = app.project;

    function imp(name) {
        var io = new ImportOptions(new File(A + name));
        var it = proj.importFile(io);
        it.parentFolder = fAssets;
        return it;
    }
    function ease(prop, inf) {
        inf = inf || 80;
        var t = prop.propertyValueType, n = 1;
        if (t == PropertyValueType.ThreeD) n = 3;
        else if (t == PropertyValueType.TwoD) n = 2;
        var e = [];
        for (var i = 0; i < n; i++) e.push(new KeyframeEase(0, inf));
        for (var k = 1; k <= prop.numKeys; k++) {
            try { prop.setTemporalEaseAtKey(k, e, e); } catch (err) {}
            if (t == PropertyValueType.ThreeD_SPATIAL || t == PropertyValueType.TwoD_SPATIAL) {
                try { prop.setSpatialAutoBezierAtKey(k, true); prop.setSpatialContinuousAtKey(k, true); } catch (err2) {}
            }
        }
    }
    function keys(prop, tv, inf) {      // tv: [[t, v], ...]
        for (var i = 0; i < tv.length; i++) prop.setValueAtTime(tv[i][0], tv[i][1]);
        ease(prop, inf);
    }
    function holdAt(prop, t) {           // make keyframe at time t a hold-out (hard cut)
        var k = prop.nearestKeyIndex(t);
        prop.setInterpolationTypeAtKey(k, prop.keyInInterpolationType(k), KeyframeInterpolationType.HOLD);
    }
    function fx(layer, match) { return layer.property("ADBE Effect Parade").addProperty(match); }
    function setP(effect, idOrName, v) { try { effect.property(idOrName).setValue(v); } catch (e) {} }

    // ---------- project structure ----------
    var fRoot = proj.items.addFolder("STENCIL2_HERO");
    var fAssets = proj.items.addFolder("assets"); fAssets.parentFolder = fRoot;

    var iFront = imp("gafa_frontal.png"), i34 = imp("gafa_34.png"), iLatI = imp("gafa_lateral_izq.png"),
        iLatD = imp("gafa_lateral_der.png"), iMacro = imp("gafa_macro.png"), iPod = imp("podio.png"),
        iScript = imp("logo_script_hd.png"), iGren = imp("logo_granada.png"), iDust = imp("polvo_overlay.mp4");

    // ---------- logo end card precomp ----------
    var L = proj.items.addComp("LOGO_FINAL", W, H, 1, 3.6, FPS); L.parentFolder = fRoot;
    var ctrl = L.layers.addNull(); ctrl.name = "ESCALA_LOGO";
    ctrl.property("Position").setValue([CX, 540]);
    keys(ctrl.property("Scale"), [[0, [100, 100]], [3.6, [104, 104]]], 40);

    var gr = L.layers.add(iGren); gr.name = "GRANADA";
    gr.property("Anchor Point").setValue([1280, 1679]);
    gr.property("Scale").setValue([19.5, 19.5]);
    gr.property("Position").setValue([CX, 420]);
    gr.parent = ctrl;
    var gf = fx(gr, "ADBE Fill"); setP(gf, "ADBE Fill-0002", [0.96, 0.95, 0.93]);
    var gw = fx(gr, "ADBE Linear Wipe");
    setP(gw, "ADBE Linear Wipe-0002", 180); setP(gw, "ADBE Linear Wipe-0003", 90);
    keys(gw.property("ADBE Linear Wipe-0001"), [[0, 100], [1.3, 0]], 70);
    try { var gre = fx(gr, "ADBE Roughen Edges");
          keys(gre.property("Border"), [[0.0, 22], [1.0, 22], [1.5, 0]], 60); } catch (e) {}
    try { var gls = fx(gr, "CC Light Sweep");
          setP(gls, "Direction", -30); setP(gls, "Width", 60); setP(gls, "Sweep Intensity", 60); setP(gls, "Edge Intensity", 0);
          setP(gls, "Light Color", [1, 0.82, 0.55]);
          keys(gls.property("Center"), [[1.5, [-300, 500]], [2.5, [2400, 500]]], 60); } catch (e) {}
    var gg = fx(gr, "ADBE Glo2"); setP(gg, "ADBE Glo2-0002", 60); setP(gg, "ADBE Glo2-0003", 45); setP(gg, "ADBE Glo2-0004", 0.6);

    var sc = L.layers.add(iScript); sc.name = "SCRIPT";
    sc.property("Scale").setValue([24, 24]);
    sc.property("Position").setValue([CX, 790]);
    sc.parent = ctrl;
    var sw = fx(sc, "ADBE Linear Wipe");
    setP(sw, "ADBE Linear Wipe-0002", 270); setP(sw, "ADBE Linear Wipe-0003", 60);
    keys(sw.property("ADBE Linear Wipe-0001"), [[1.2, 100], [2.3, 0]], 70);
    var sgl = fx(sc, "ADBE Glo2"); setP(sgl, "ADBE Glo2-0002", 60); setP(sgl, "ADBE Glo2-0003", 25); setP(sgl, "ADBE Glo2-0004", 0.5);
    gr.moveToBeginning();

    // ---------- main comp ----------
    var C = proj.items.addComp("STENCIL2_HERO_MAIN", W, H, 1, DUR, FPS); C.parentFolder = fRoot;
    C.motionBlur = true; C.shutterAngle = 220; C.shutterPhase = -110;
    C.bgColor = [0, 0, 0];
    try { C.renderer = "ADBE Advanced 3d"; } catch (e) {}   // Classic 3D (DOF + motion blur)

    // wall
    var wall = C.layers.addSolid([0.03, 0.028, 0.026], "PARED", 9000, 5600, 1);
    wall.threeDLayer = true; wall.property("Position").setValue([CX, 500, 1500]);
    var wr = fx(wall, "ADBE Ramp");
    setP(wr, "ADBE Ramp-0001", [4500, 2650]); setP(wr, "ADBE Ramp-0002", [0.11, 0.095, 0.08]);
    setP(wr, "ADBE Ramp-0003", [4500 + 2600, 2650]); setP(wr, "ADBE Ramp-0004", [0.008, 0.008, 0.008]);
    setP(wr, "ADBE Ramp-0005", 2);

    // floor
    var floor = C.layers.addSolid([0.03, 0.03, 0.03], "SUELO", 10000, 10000, 1);
    floor.threeDLayer = true; floor.property("Position").setValue([CX, FLOOR_Y, 800]);
    floor.property("X Rotation").setValue(90);
    var fr = fx(floor, "ADBE Ramp");
    setP(fr, "ADBE Ramp-0001", [5000, 4200]); setP(fr, "ADBE Ramp-0002", [0.085, 0.075, 0.065]);
    setP(fr, "ADBE Ramp-0003", [5000 + 2200, 4200]); setP(fr, "ADBE Ramp-0004", [0.0, 0.0, 0.0]);
    setP(fr, "ADBE Ramp-0005", 2);

    // arch (shape layer): inner panel + neon outline + thin inner line
    function archPath(r, hSide, closed) {
        var k = 0.5523 * r, s = new Shape();
        s.vertices = [[-r, 0], [-r, -hSide], [0, -hSide - r], [r, -hSide], [r, 0]];
        s.inTangents = [[0, 0], [0, 0], [-k, 0], [0, -k], [0, 0]];
        s.outTangents = [[0, 0], [0, -k], [k, 0], [0, 0], [0, 0]];
        s.closed = closed;
        return s;
    }
    function addArchGroup(layer, name, r, hSide, closed, fillCol, strokeCol, strokeW, opac) {
        var g = layer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group"); g.name = name;
        var v = g.property("ADBE Vectors Group");
        var p = v.addProperty("ADBE Vector Shape - Group"); p.property("ADBE Vector Shape").setValue(archPath(r, hSide, closed));
        if (fillCol) { var f = v.addProperty("ADBE Vector Graphic - Fill"); f.property("ADBE Vector Fill Color").setValue(fillCol); f.property("ADBE Vector Fill Opacity").setValue(opac); }
        if (strokeCol) { var st = v.addProperty("ADBE Vector Graphic - Stroke"); st.property("ADBE Vector Stroke Color").setValue(strokeCol);
                         st.property("ADBE Vector Stroke Width").setValue(strokeW); st.property("ADBE Vector Stroke Opacity").setValue(opac);
                         try { st.property("ADBE Vector Stroke Line Cap").setValue(2); } catch (e) {} }
        return g;
    }
    var archPanel = C.layers.addShape(); archPanel.name = "ARCO_PANEL"; archPanel.threeDLayer = true;
    archPanel.property("Position").setValue([CX, FLOOR_Y, 700]);
    addArchGroup(archPanel, "panel", 600, 650, true, [0.075, 0.066, 0.058], null, 0, 100);
    var apr = fx(archPanel, "ADBE Ramp");   // soft top-light inside the arch
    setP(apr, "ADBE Ramp-0001", [960, -300]); setP(apr, "ADBE Ramp-0002", [0.16, 0.14, 0.115]);
    setP(apr, "ADBE Ramp-0003", [960, 900]); setP(apr, "ADBE Ramp-0004", [0.03, 0.028, 0.026]);
    setP(apr, "ADBE Ramp-0005", 2);

    var arch = C.layers.addShape(); arch.name = "ARCO_NEON"; arch.threeDLayer = true;
    arch.property("Position").setValue([CX, FLOOR_Y, 690]);
    addArchGroup(arch, "neon", 600, 650, false, null, [1, 0.86, 0.64], 9, 100);
    addArchGroup(arch, "linea_int", 560, 650, false, null, [1, 0.8, 0.55], 2.5, 35);
    var ag1 = fx(arch, "ADBE Glo2"); setP(ag1, "ADBE Glo2-0002", 40); setP(ag1, "ADBE Glo2-0003", 25); setP(ag1, "ADBE Glo2-0004", 1.4);
    var ag2 = fx(arch, "ADBE Glo2"); setP(ag2, "ADBE Glo2-0002", 30); setP(ag2, "ADBE Glo2-0003", 160); setP(ag2, "ADBE Glo2-0004", 0.9);
    keys(arch.property("Opacity"), [[0.25, 0], [0.35, 85], [0.42, 15], [0.5, 100], [0.6, 55], [0.68, 100]], 33);

    // neon script logo
    var neon = C.layers.add(iScript); neon.name = "LOGO_NEON"; neon.threeDLayer = true;
    neon.property("Position").setValue([CX, 210, 660]);
    neon.property("Scale").setValue([62, 62, 62]);
    var nf = fx(neon, "ADBE Fill"); setP(nf, "ADBE Fill-0002", [1, 0.88, 0.68]);
    var ng1 = fx(neon, "ADBE Glo2"); setP(ng1, "ADBE Glo2-0002", 40); setP(ng1, "ADBE Glo2-0003", 30); setP(ng1, "ADBE Glo2-0004", 1.5);
    var ng2 = fx(neon, "ADBE Glo2"); setP(ng2, "ADBE Glo2-0002", 30); setP(ng2, "ADBE Glo2-0003", 180); setP(ng2, "ADBE Glo2-0004", 0.8);
    keys(neon.property("Opacity"), [[0.05, 0], [0.15, 80], [0.22, 10], [0.3, 100], [0.38, 35], [0.46, 100]], 33);

    // podium (billboard facing camera)
    var pod = C.layers.add(iPod); pod.name = "PODIO"; pod.threeDLayer = true;
    pod.property("Anchor Point").setValue([900, 150]);
    pod.property("Position").setValue([CX, TOP_Y, 0]);
    pod.property("Scale").setValue([88, 88, 88]);
    pod.autoOrient = AutoOrientType.CAMERA_OR_POINT_OF_INTEREST;

    // contact shadow
    var sh = C.layers.addShape(); sh.name = "SOMBRA_GAFA"; sh.threeDLayer = true;
    var shg = sh.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    var el = shg.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse");
    el.property("ADBE Vector Ellipse Size").setValue([700, 120]);
    var shf = shg.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    shf.property("ADBE Vector Fill Color").setValue([0, 0, 0]);
    sh.property("Position").setValue([CX, TOP_Y - 2, GZ]); sh.property("X Rotation").setValue(90);
    sh.property("Opacity").setValue(75);
    var shb = fx(sh, "ADBE Gaussian Blur 2"); setP(shb, "ADBE Gaussian Blur 2-0001", 45);

    // glasses layers (cutouts from the original photos) — all face the camera
    function glasses(item, name, scale, anchorYfrac, tIn, tOut) {
        var l = C.layers.add(item); l.name = name; l.threeDLayer = true;
        l.property("Anchor Point").setValue([item.width / 2, item.height * anchorYfrac]);
        l.property("Position").setValue([CX, TOP_Y, GZ]);
        l.property("Scale").setValue([scale, scale, scale]);
        l.autoOrient = AutoOrientType.CAMERA_OR_POINT_OF_INTEREST;
        l.motionBlur = true;
        l.inPoint = tIn; l.outPoint = tOut;
        try { var ls = fx(l, "CC Light Sweep");
              setP(ls, "Direction", -25); setP(ls, "Width", item.width * 0.05); setP(ls, "Sweep Intensity", 35); setP(ls, "Edge Intensity", 0);
              setP(ls, "Light Color", [1, 0.85, 0.6]);
              keys(ls.property("Center"), [[tIn + 0.3, [-item.width * 0.2, item.height / 2]], [tOut - 0.1, [item.width * 1.2, item.height / 2]]], 50);
        } catch (e) {}
        return l;
    }
    // shot times
    var T1 = 2.6, T2 = 4.8, T3 = 6.6, T4 = 8.2, T5 = 10.4, T6 = 12.0;
    var gF1 = glasses(iFront, "GAFA_FRONTAL", 26, 0.985, 0, T1);
    var g34 = glasses(i34, "GAFA_34", 28, 0.985, T1, T2);
    var gLI = glasses(iLatI, "GAFA_LATERAL_IZQ", 31, 0.985, T2, T3);
    var gLD = glasses(iLatD, "GAFA_LATERAL_DER", 31, 0.985, T3, T4);
    var gM = glasses(iMacro, "GAFA_MACRO", 50, 0.5, T4, T5);
    gM.property("Position").setValue([CX, 560, GZ]);
    var gF2 = glasses(iFront, "GAFA_FRONTAL_FINAL", 26, 0.985, T5, DUR);
    // hide shadow during macro
    var sop = sh.property("Opacity");
    sop.setValueAtTime(0, 75); sop.setValueAtTime(T4, 0); sop.setValueAtTime(T5, 75);
    for (var q = 1; q <= sop.numKeys; q++) sop.setInterpolationTypeAtKey(q, KeyframeInterpolationType.HOLD, KeyframeInterpolationType.HOLD);

    // focus target null
    var foco = C.layers.addNull(); foco.name = "FOCO"; foco.threeDLayer = true;
    var fp = foco.property("Position");

    // camera (two-node, 50mm)
    var cam = C.layers.addCamera("CAMARA", [CX, 540]);
    cam.property("Zoom").setValue(2666);
    var co = cam.property("ADBE Camera Options Group");
    co.property("ADBE Camera Depth of Field").setValue(1);
    co.property("ADBE Camera Aperture").setValue(140);
    co.property("ADBE Camera Blur Level").setValue(100);
    co.property("ADBE Camera Focus Distance").expression =
        'length(transform.position, thisComp.layer("FOCO").transform.position);';
    var cp = cam.property("Position"), ci = cam.property("Point of Interest");
    var G = [CX, 610, GZ];
    var d = 1 / FPS, WH = 0.22;   // whip half duration

    // --- camera path ---
    // S1 front: slow dolly-in + crane down
    cp.setValueAtTime(0, [CX, 430, -4300]);         ci.setValueAtTime(0, [CX, 470, 0]);
    cp.setValueAtTime(T1 - WH, [CX, 500, -3150]);   ci.setValueAtTime(T1 - WH, [CX, 560, GZ]);
    cp.setValueAtTime(T1, [CX + 260, 500, -3050]);  ci.setValueAtTime(T1, [CX + 1500, 560, GZ]);      // whip out (to the right)
    // S2 3/4: arrives from the left, slow orbit right->left
    cp.setValueAtTime(T1 + d, [1560, 500, -2950]);  ci.setValueAtTime(T1 + d, [-500, 590, GZ]);
    cp.setValueAtTime(T1 + WH, [1500, 500, -2900]); ci.setValueAtTime(T1 + WH, [960, 600, GZ]);
    cp.setValueAtTime(T2 - WH, [1120, 520, -2500]); ci.setValueAtTime(T2 - WH, [920, 600, GZ]);
    cp.setValueAtTime(T2, [1200, 520, -2450]);      ci.setValueAtTime(T2, [2400, 600, GZ]);
    // S3 lateral izq: truck left->right
    cp.setValueAtTime(T2 + d, [640, 520, -2350]);   ci.setValueAtTime(T2 + d, [-600, 620, GZ]);
    cp.setValueAtTime(T2 + WH, [700, 520, -2300]);  ci.setValueAtTime(T2 + WH, [960, 620, GZ]);
    cp.setValueAtTime(T3 - WH, [1140, 520, -2180]); ci.setValueAtTime(T3 - WH, [990, 620, GZ]);
    cp.setValueAtTime(T3, [1220, 520, -2150]);      ci.setValueAtTime(T3, [2500, 620, GZ]);
    // S4 lateral der: truck right->left
    cp.setValueAtTime(T3 + d, [1300, 520, -2350]);  ci.setValueAtTime(T3 + d, [-600, 620, GZ]);
    cp.setValueAtTime(T3 + WH, [1250, 520, -2300]); ci.setValueAtTime(T3 + WH, [960, 620, GZ]);
    cp.setValueAtTime(T4 - d, [820, 520, -2150]);   ci.setValueAtTime(T4 - d, [940, 620, GZ]);
    // S5 macro: hard cut, push-in to "HECHO EN SAN ANTONIO" with rack focus lens -> text
    cp.setValueAtTime(T4, [880, 470, -1500]);       ci.setValueAtTime(T4, [930, 455, GZ]);
    cp.setValueAtTime(T5 - WH, [1110, 410, -1000]); ci.setValueAtTime(T5 - WH, [1110, 405, GZ]);
    cp.setValueAtTime(T5, [1180, 410, -980]);       ci.setValueAtTime(T5, [2600, 405, GZ]);
    // S6 front final: pull back to the hero framing
    cp.setValueAtTime(T5 + d, [CX - 80, 540, -2350]); ci.setValueAtTime(T5 + d, [-500, 560, GZ]);
    cp.setValueAtTime(T5 + WH, [CX - 40, 540, -2350]); ci.setValueAtTime(T5 + WH, [CX, 560, GZ]);
    cp.setValueAtTime(T6 + 0.6, [CX, 460, -3700]);  ci.setValueAtTime(T6 + 0.6, [CX, 490, 0]);
    cp.setValueAtTime(DUR, [CX, 440, -3900]);       ci.setValueAtTime(DUR, [CX, 480, 0]);
    ease(cp, 75); ease(ci, 75);
    // linear in/out around whip keys so the whip accelerates hard
    var whipT = [T1, T2, T3, T5];
    for (var w = 0; w < whipT.length; w++) {
        var tt = whipT[w];
        var props = [cp, ci];
        for (var p = 0; p < 2; p++) {
            var pr = props[p], k = pr.nearestKeyIndex(tt);
            pr.setTemporalEaseAtKey(k, [new KeyframeEase(0, 0.1)], [new KeyframeEase(0, 0.1)]);
            pr.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.HOLD);
            var k2 = pr.nearestKeyIndex(tt + d);
            pr.setTemporalEaseAtKey(k2, [new KeyframeEase(0, 0.1)], [new KeyframeEase(0, 0.1)]);
        }
    }
    holdAt(cp, T4 - d); holdAt(ci, T4 - d);

    // focus path
    fp.setValueAtTime(0, G);
    fp.setValueAtTime(T4 - 0.35, G);
    fp.setValueAtTime(T4 - d, [CX, 610, 900]);             // drift out of focus before macro cut
    fp.setValueAtTime(T4, [760, 470, -200]);               // macro starts defocused
    fp.setValueAtTime(T4 + 0.5, [800, 480, GZ]);           // lens edge sharp
    fp.setValueAtTime(T4 + 1.2, [1110, 402, GZ]);          // rack to the engraving
    fp.setValueAtTime(T5, [1110, 402, GZ]);
    fp.setValueAtTime(T5 + d, G);
    ease(fp, 70); holdAt(fp, T4 - d); holdAt(fp, T5);

    // dust overlay (2D, screen)
    var dust = C.layers.add(iDust); dust.name = "POLVO"; dust.blendingMode = BlendingMode.SCREEN;
    dust.property("Opacity").setValue(70);

    // vignette
    var vg = C.layers.addSolid([0, 0, 0], "VINETA", W, H, 1);
    var m = vg.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
    var ms = new Shape(), kx = 0.5523;
    var rx = W * 0.62, ry = H * 0.72, cx = W / 2, cy = H / 2;
    ms.vertices = [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
    ms.inTangents = [[-rx * kx, 0], [0, -ry * kx], [rx * kx, 0], [0, ry * kx]];
    ms.outTangents = [[rx * kx, 0], [0, ry * kx], [-rx * kx, 0], [0, -ry * kx]];
    ms.closed = true;
    m.property("ADBE Mask Shape").setValue(ms);
    m.property("ADBE Mask Feather").setValue([520, 520]);
    m.inverted = true;
    vg.property("Opacity").setValue(80);

    // fades: open from black, close to black before logo
    var fade = C.layers.addSolid([0, 0, 0], "FUNDIDO_NEGRO", W, H, 1);
    keys(fade.property("Opacity"), [[0, 100], [0.7, 0], [T6 - 0.4, 0], [T6 + 0.2, 100]], 60);

    // logo end card
    var lg = C.layers.add(L); lg.name = "LOGO_FINAL"; lg.startTime = T6; lg.inPoint = T6;
    keys(lg.property("Opacity"), [[DUR - 0.5, 100], [DUR, 0]], 60);
    lg.moveToBeginning();

    C.openInViewer();
    app.endUndoGroup();
    try { proj.save(new File(base.fullName + "/STENCIL2_HERO.aep")); } catch (e) {}
    alert("STENCIL2 hero listo: comp STENCIL2_HERO_MAIN (15 s).");
})();
