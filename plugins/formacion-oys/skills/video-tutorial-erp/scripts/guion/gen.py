import os
#!/usr/bin/env python3
"""Genera video/src/data/guion.json y valida clips/claves. Uso: gen.py [--frames]"""
import json, sys, re, unicodedata, subprocess, copy, os, math
sys.path.insert(0, os.path.dirname(__file__))
from escenas import E, V1, V2

BASE = os.environ.get("PROYECTO", os.getcwd())  # carpeta base del proyecto
VIDEO = BASE + "/video"
DUR = {V1: 860.07, V2: 6396.46}
NOMBRE = {V1: "v1", V2: "v2"}
# tramos sucios (no se pueden usar en clips)
SUCIO = {
    V1: [(0, 100, "Word del plan de formación"), (455, 488, "hoja en blanco / cargando"), (434, 455, "menú Características desplegado"), (790, 861, "ERR_CONNECTION_TIMED_OUT")],
    V2: [(955, 1049, "timeout / Camtasia / carga"), (1058, 1069.5, "JRepException"), (1165, 1199, "avisos Gmail"),
         (3338, 3355, "lista de proveedores con nombres de personas"), (3695, 3705, "ventana emergente en blanco"),
         (3800, 3960, "rejilla Usuarios: nombres y e-mails reales"), (3075.5, 3117, "pantalla de inicio de sesión"), (5695, 5712, "aviso de Google Calendar"), (4140, 4192, "ventana de e-mail / dirección tecleada"),
         (5383.6, 5391.5, "pantalla en blanco (carga)"), (5797, 5807, "pestaña de asiento intercalada"), (6337, 6339.5, "pantalla en blanco"), (5659, 5684, "Google Calendar"), (5970, 6135, "pantalla fija CRC"),
         (6389, 6397, "widget del grabador")],
}
CFG = {"voz": "es-ES-XimenaNeural", "rate": "+0%", "entrada": 0.6, "colchon": 1.3, "pausaCapitulo": 1.2,
       "transicion": 0.8, "subtitulos": True, "marca": "ERP · Compras"}
WPS_EST = 2.45
PLAN = {}
_pl = BASE + "/video/out/plan.txt"
if os.path.exists(_pl):
    for _l in open(_pl, encoding="utf-8").read().splitlines()[1:]:
        _p = _l.split()
        try:
            PLAN[_p[0]] = float(_p[3])
        except (IndexError, ValueError):
            pass   # estimación del formato
WPS_SAFE = 2.75  # para dimensionar la velocidad del clip (voz algo más rápida)


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z0-9ñ\.\-,']+", s)


def words(s):
    return len(s.split())


def find_seq(narr, claves):
    toks = [t.strip(".,") for t in norm(narr)]
    pos = 0; out = []
    for c in claves:
        if c is None:
            out.append(None); continue
        ct = [t.strip(".,") for t in norm(c)]
        hit = None
        for i in range(pos, len(toks) - len(ct) + 1):
            if all(toks[i + j].startswith(ct[j]) for j in range(len(ct))):
                hit = i; break
        out.append(hit)
        if hit is not None:
            pos = hit + 1
    return out


def inside(r, rec):
    return r["x"] >= rec["x"] - 2 and r["y"] >= rec["y"] - 2 and r["x"] + r["w"] <= rec["x"] + rec["w"] + 2 and r["y"] + r["h"] <= rec["y"] + rec["h"] + 2


def build():
    errs, warns, info = [], [], []
    out = []
    ids = set()
    for k, e in enumerate(E):
        e = copy.deepcopy(e)
        if e["id"] in ids: errs.append(f"id repetido {e['id']}")
        ids.add(e["id"])
        narr = e.get("narracion", "")
        w = words(narr)
        est = w / WPS_EST
        nxt_cap = k + 1 < len(E) and E[k + 1]["tipo"] == "capitulo"
        dur = CFG["entrada"] + est + CFG["colchon"] + (CFG["pausaCapitulo"] if nxt_cap else 0)
        e["_est"] = round(dur, 1)
        # claves por lista
        for lista in ("items", "nodos", "callouts", "zooms", "foco", "filas", "pasos"):
            if lista in e:
                cl = [x.get("clave") for x in e[lista]]
                hits = find_seq(narr, cl)
                for x, h in zip(e[lista], hits):
                    if x.get("clave") and h is None:
                        errs.append(f"{e['id']}.{lista}: clave «{x['clave']}» no está (en orden) en la narración")
        if e["tipo"] == "estructura":
            seq = [e["raiz"].get("clave")]
            for r in e["ramas"]:
                seq.append(r.get("clave"))
                seq += [h.get("clave") for h in r.get("hijos", [])]
            for c, h in zip(seq, find_seq(narr, seq)):
                if c and h is None:
                    errs.append(f"{e['id']}.estructura: clave «{c}» no está (en orden)")
        if e["tipo"] == "pantalla":
            c = e["clip"]; v = c["src"]
            if v not in DUR: errs.append(f"{e['id']}: vídeo desconocido")
            if not (0 <= c["inicio"] < c["fin"] <= DUR[v]): errs.append(f"{e['id']}: tramo fuera del vídeo")
            for a, b, why in SUCIO[v]:
                if c["inicio"] < b and c["fin"] > a:
                    errs.append(f"{e['id']}: clip {c['inicio']}-{c['fin']} pisa tramo sucio {a}-{b} ({why})")
            rec = e.get("recorte", {"x": 0, "y": 0, "w": 1680, "h": 1048})
            if rec["x"] < 0 or rec["y"] < 0 or rec["x"] + rec["w"] > 1680 or rec["y"] + rec["h"] > 1048:
                errs.append(f"{e['id']}: recorte fuera de 1680x1048")
            if rec["y"] + rec["h"] > 1007:
                errs.append(f"{e['id']}: recorte incluye la barra de Windows")
            if rec["h"] / rec["w"] > 0.68:
                warns.append(f"{e['id']}: recorte muy alto (h/w={rec['h']/rec['w']:.2f})")
            for lst in ("callouts", "zooms"):
                for x in e.get(lst, []):
                    if "rect" in x and not inside(x["rect"], rec):
                        errs.append(f"{e['id']}.{lst}: rect {x['rect']} fuera del recorte")
            L = c["fin"] - c["inicio"]
            if e["id"] in PLAN:   # duración real de la escena (video/out/plan.txt, tras voz.py)
                avail = PLAN[e["id"]] - e.get("clipDesde", 0.3) - 0.8
            else:
                avail = CFG["entrada"] + w / WPS_SAFE + CFG["colchon"] - 0.3 - 0.4
            vel = 1.0
            if L > avail:
                vel = math.ceil(L / avail * 20) / 20
                if vel > 2.2: errs.append(f"{e['id']}: velocidad {vel} > 2,2: recorta el tramo")
                e["velocidad"] = vel
            e["_vel"] = vel
            e.setdefault("tamano", {"w": 1680, "h": 1048})
            for lst in ("callouts", "zooms", "foco"):
                for x in e.get(lst, []):
                    if "_vs" in x:
                        x["t"] = round(e.get("clipDesde", 0.3) + (x.pop("_vs") - c["inicio"]) / vel, 2)
                    if "_vshasta" in x:
                        x["hasta"] = round(e.get("clipDesde", 0.3) + (x.pop("_vshasta") - c["inicio"]) / vel, 2)
            if L / vel + 0.3 > dur:
                warns.append(f"{e['id']}: clip ({L/vel:.1f}s) más largo que la escena estimada ({dur:.1f}s)")
        out.append(e)
    return out, errs, warns


def to_json(scenes):
    def strip(o):
        if isinstance(o, dict):
            return {k: strip(v) for k, v in o.items() if not k.startswith("_")}
        if isinstance(o, list):
            return [strip(v) for v in o]
        return o
    return {"titulo": "Compras en el ERP: de la tarifa a la factura", "config": CFG, "escenas": [strip(s) for s in scenes]}


def frames(scenes, sel=None):
    """Fotograma anotado por escena de pantalla: recorte (blanco) + callouts (colores) + zooms (cian)."""
    od = BASE + "/kb/verif/clips"; os.makedirs(od, exist_ok=True)
    cols = ["red", "lime", "yellow", "magenta", "orange", "blue", "purple"]
    for e in scenes:
        if e["tipo"] != "pantalla" or (sel and e["id"] not in sel): continue
        c = e["clip"]; rec = e["recorte"]
        v = VIDEO + "/" + c["src"]
        for tag, t in (("a", c["inicio"] + 0.5), ("b", (c["inicio"] + c["fin"]) / 2), ("c", c["fin"] - 0.5)):
            f = []
            for i, x in enumerate(e.get("callouts", [])):
                r = x["rect"]; f.append(f"drawbox=x={r['x']}:y={r['y']}:w={r['w']}:h={r['h']}:color={cols[i%len(cols)]}@0.9:t=3")
            for x in e.get("zooms", []):
                if "rect" in x:
                    r = x["rect"]; f.append(f"drawbox=x={r['x']}:y={r['y']}:w={r['w']}:h={r['h']}:color=cyan@0.6:t=2")
            f.append(f"crop={rec['w']}:{rec['h']}:{rec['x']}:{rec['y']}")
            f.append("scale=900:-2")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", os.path.normpath(v), "-frames:v", "1",
                            "-vf", ",".join(f), "-q:v", "5", f"{od}/{e['id']}_{tag}.jpg"], check=True)


if __name__ == "__main__":
    scenes, errs, warns = build()
    tot = sum(s["_est"] for s in scenes) - CFG["transicion"] * (len(scenes) - 1)
    print(f"escenas={len(scenes)} pantallas={sum(1 for s in scenes if s['tipo']=='pantalla')} total≈{tot/60:.1f} min palabras={sum(words(s.get('narracion','')) for s in scenes)}")
    for x in errs: print("ERROR", x)
    for x in warns: print("AVISO", x)
    json.dump({"scenes": scenes}, open(os.path.dirname(__file__) + "/scenes_built.json", "w"), ensure_ascii=False, indent=1)
    if "--write" in sys.argv:
        g = to_json(scenes)
        open(VIDEO + "/src/data/guion.json", "w", encoding="utf-8").write(json.dumps(g, ensure_ascii=False, indent=2) + "\n")
        print("guion.json escrito")
    if "--frames" in sys.argv:
        sel = [a for a in sys.argv[2:] if not a.startswith("--")] or None
        frames(scenes, sel)
        print("fotogramas anotados en kb/verif/clips")
