// STENCIL2 — ajustes de composición + render H.264
(function () {
    var base = new File($.fileName).parent;
    var C = null;
    for (var i = 1; i <= app.project.numItems; i++) {
        var it = app.project.item(i);
        if (it instanceof CompItem && it.name == "STENCIL2_HERO_MAIN") C = it;
    }
    if (!C) { alert("No encuentro STENCIL2_HERO_MAIN"); return; }
    app.beginUndoGroup("STENCIL2 ajustes");
    var TOP = 738, GZ = -40, FPS = 24;
    function L(n) { return C.layer(n); }
    function setP(e, id, v) { try { e.property(id).setValue(v); } catch (x) {} }

    // neon logo: smaller, higher, softer glow
    var neon = L("LOGO_NEON");
    neon.property("Scale").setValue([40, 40, 40]);
    neon.property("Position").setValue([960, 150, 660]);
    var fxs = neon.property("ADBE Effect Parade"), gi = 0;
    for (var k = 1; k <= fxs.numProperties; k++) {
        var e = fxs.property(k);
        if (e.matchName == "ADBE Glo2") { gi++; setP(e, "ADBE Glo2-0004", gi == 1 ? 0.9 : 0.45); setP(e, "ADBE Glo2-0003", gi == 1 ? 22 : 120); }
    }
    // arch glow a touch softer
    var arch = L("ARCO_NEON"); var afx = arch.property("ADBE Effect Parade"); gi = 0;
    for (var k2 = 1; k2 <= afx.numProperties; k2++) { var e2 = afx.property(k2);
        if (e2.matchName == "ADBE Glo2") { gi++; setP(e2, "ADBE Glo2-0004", gi == 1 ? 1.0 : 0.6); } }

    // glasses: sit on the podium, sizes, contrast
    var G = [["GAFA_FRONTAL", 26], ["GAFA_34", 26], ["GAFA_LATERAL_IZQ", 25], ["GAFA_LATERAL_DER", 25], ["GAFA_FRONTAL_FINAL", 26], ["GAFA_MACRO", 50]];
    for (var g = 0; g < G.length; g++) {
        var l = L(G[g][0]); if (!l) continue;
        if (G[g][0] != "GAFA_MACRO") { l.property("Position").setValue([960, TOP, GZ]); }
        l.property("Scale").setValue([G[g][1], G[g][1], G[g][1]]);
        try { var bc = l.property("ADBE Effect Parade").addProperty("ADBE Brightness & Contrast 2");
              setP(bc, "ADBE Brightness & Contrast 2-0001", -8); setP(bc, "ADBE Brightness & Contrast 2-0002", 16); } catch (x) {}
    }
    var sh = L("SOMBRA_GAFA");
    sh.property("Position").setValue([960, TOP - 2, GZ]);
    sh.property("Contents").property(1).property("Contents").property(1).property("ADBE Vector Ellipse Size").setValue([900, 170]);

    // focus target follows new glasses height
    var fp = L("FOCO").property("Position");
    for (var q = 1; q <= fp.numKeys; q++) { var v = fp.keyValue(q); if (v[1] == 610) fp.setValueAtKey(q, [v[0], 645, v[2]]); }

    // macro: end slightly wider so the engraving breathes
    var cam = L("CAMARA"), cp = cam.property("Position"), T5 = 10.4, WH = 0.22;
    var kk = cp.nearestKeyIndex(T5 - WH); cp.setValueAtKey(kk, [1100, 415, -1180]);

    app.endUndoGroup();
    app.project.save();

    // render queue -> H.264
    var rq = app.project.renderQueue.items.add(C);
    try { rq.applyTemplate("Best Settings"); } catch (x) {}
    var om = rq.outputModule(1), ok = false;
    var names = om.templates;
    var pref = ["H.264 - Match Render Settings - 15 Mbps", "H.264 - Match Render Settings - 40 Mbps", "H.264 - Match Render Settings - 5 Mbps"];
    for (var p = 0; p < pref.length && !ok; p++) for (var n = 0; n < names.length; n++) if (names[n] == pref[p]) { om.applyTemplate(pref[p]); ok = true; break; }
    om.file = new File(base.fullName + (ok ? "/stencil2_hero_ae.mp4" : "/stencil2_hero_ae.mov"));
    app.project.renderQueue.render();
    alert("Render terminado: " + om.file.fsName);
})();
