#!/usr/bin/env python3
"""gen_v2.py — guion y clips sincronizados del vídeo v2 (Compras en Deister Axional VNext).

Dos pasos (ver v2/video/LEEME_V2.md):

  python3 gen_v2.py                 une v2/cap01.json … cap10.json en v2/video/src/data/guion.json
  python3 gen_v2.py --clips         (tras voz.py) crea public/clips/<id>.mp4 re-temporizados con la voz
                                    y los efectos (zooms, resaltes, callouts, focos) desde rec/<id>.json

Opciones:
  --entrada F      guion o capítulo JSON a usar en lugar de los capNN.json (p. ej. un guion de prueba)
  --salida F       guion de salida (por defecto video/src/data/guion.json)
  --solo a,b       con --clips: solo esas escenas
  --force          con --clips: rehace los clips aunque no hayan cambiado
  --res 2560       ancho del clip (2560×1440 por defecto; 1920 o 3200 también valen)

Sin dependencias: Python 3 + ffmpeg/ffprobe en el PATH.

Re-temporizado: cada evento del log con «clave» (click/type/fill/resalta/pick/key) se ancla al instante en que la voz
dice esa clave (prefijo sin acentos, en orden), 0,3 s antes. Entre anclas: si el vídeo va por delante se congela justo
antes de que el cursor arranque hacia el objetivo; si va por detrás se acelera el tramo hasta 2× y, si no basta, el
retraso se arrastra (el siguiente tramo se congela menos). Los fotogramas se remapean uno a uno (decodificar → Python →
codificar), así que no hay saltos ni mezclas.
"""
import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

V2 = Path(__file__).resolve().parent.parent
VIDEO = V2 / "video"
DATA = VIDEO / "src" / "data"
REC = V2 / "rec"
CLIPS = VIDEO / "public" / "clips"
SYNC = DATA / "sync.json"
TAPAS = V2 / "tapas.json"   # parches por escena (tapan errores del vídeo); ver tools/busca_tapa.py

FPS = 30            # fotogramas por segundo del screencast (puppeteer duplica a 30/s aunque el webm diga 25)
SRC_W, SRC_H = 3200, 1800   # coordenadas de la escena = px CSS × 2
ANTICIPO = 0.3      # el evento ocurre 0,3 s antes de la palabra
VEL_MAX = 3.0        # tramos en que solo se mueve el cursor o se espera
VEL_TECLEO = 2.0     # tramos con tecleo
CLIP_DESDE = 0.3
CONGELADO_MAX = 4.0  # s de imagen quieta al final con la voz hablando a partir de los cuales se actúa
VEL_LENTA = 0.6      # ralentización máxima del tramo final
PALABRAS_SCROLL = ("baj", "abajo", "desplaz", "deslizamos", "rueda")  # para anclar un scroll sin clave
MARGEN_FIN = 1.0

CONFIG = {
    "voz": "es-ES-XimenaNeural",
    "rate": "-5%",
    "entrada": 0.8,
    "colchon": 2.0,
    "pausaCapitulo": 2.0,
    "transicion": 0.9,
    "subtitulos": True,
    "marca": {
        "logo": "brand/oys_logo_light.png", "texto": "O&S Consultores", "copyright": "© 2026 O&S Consultores",
        "ancho": 544, "alto": 332, "zonaTexto": {"x": 140, "y": 128, "w": 290, "h": 162},
        "centroTrazo": {"x": 55, "y": 72}, "inicioTrazo": 238,
    },
}
TITULO = "Compras en Deister Axional VNext"

COMUNES = {"id", "tipo", "narracion", "voz", "rate", "etiqueta", "duracion", "colchon", "pausa", "transicion", "huecos"}
CAMPOS = {
    "portada": {"titulo", "subtitulo"},
    "capitulo": {"titulo", "numero", "subtitulo"},
    "flujo": {"titulo", "nodos", "enlaces"},
    "pantalla": {"titulo", "url", "video", "imagen", "tamano", "recorte", "clipDesde", "clipDur", "velocidad",
                 "zooms", "callouts", "resaltes", "foco", "clip"},
    "conceptos": {"titulo", "subtitulo", "items", "disposicion"},
    "estructura": {"titulo", "raiz", "ramas"},
    "tip": {"titulo", "texto"},
    "cuidado": {"titulo", "texto"},
    "comparativa": {"titulo", "etiquetas", "filas"},
    "resumen": {"titulo", "items"},
    "calculo": {"titulo", "base", "pasos", "resultado", "divisa", "decimales"},
    "cierre": {"titulo", "subtitulo", "siguientes"},
}
PROHIBIDAS = [r"axional deister", r"\bantes\b(?! de\b)(?! que\b)", r"versi[oó]n anterior", r"ha cambiado", r"aplicando cambios",
              r"\bahora\b.*\bantes\b"]


# ---------------------------------------------------------------- utilidades
def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")  # como plan.ts: «ñ» → «n»
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def find_clave(words, clave, desde=0):
    """Igual que findClave de src/lib/plan.ts: prefijo sin acentos, varias palabras, en orden."""
    cw = norm(clave).split()
    if not cw:
        return -1
    ws = [norm(w["w"]) for w in words]

    def ok(i):
        return all(i + k < len(ws) and ws[i + k].startswith(c) for k, c in enumerate(cw))

    for i in range(desde, len(ws)):
        if ok(i):
            return i
    return -1


def aviso(msg):
    print("  ! " + msg, file=sys.stderr)


def cargar(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))


def guardar(p: Path, obj):
    """Escritura atómica (fichero temporal + rename): nadie lee nunca un JSON a medias."""
    p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_name(f".{p.name}.{os.getpid()}.tmp")
    tmp.write_text(json.dumps(obj, ensure_ascii=False, indent=1), encoding="utf-8")
    os.replace(tmp, p)


def textos(obj):
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from textos(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from textos(v)


# ---------------------------------------------------------------- 1) unir capítulos
def limpiar(e: dict) -> dict:
    tipo = e.get("tipo")
    ok = COMUNES | CAMPOS.get(tipo, set())
    fuera = [k for k in e if k not in ok]
    if fuera and tipo != "pantalla":
        aviso(f"{e.get('id')}: quito campos ajenos {fuera}")
    return {k: v for k, v in e.items() if k in ok}


def unir(fuentes):
    escenas = []
    for f in fuentes:
        d = cargar(f)
        if "cap" not in d and "escenas" in d:   # ya es un guion completo
            for e in d["escenas"]:
                escenas.append(limpiar(e))
            continue
        esc = [limpiar(e) for e in d.get("escenas", [])]
        if not any(e.get("tipo") == "capitulo" for e in esc):
            tit = d.get("titulo", f"Capítulo {d['cap']}")
            cap = {"id": f"cap{int(d['cap']):02d}", "tipo": "capitulo", "numero": int(d["cap"]),
                   "titulo": tit, "narracion": f"Capítulo {int(d['cap'])}. {tit.rstrip('.')}.",
                   **({"subtitulo": d["subtitulo"]} if d.get("subtitulo") else {})}
            i = 0
            while i < len(esc) and esc[i].get("tipo") == "portada":  # la portada va antes del capítulo
                i += 1
            esc.insert(i, cap)
        escenas.extend(esc)
    # portada y cierre por defecto
    if not any(e["tipo"] == "portada" for e in escenas):
        aviso("sin portada: añado una por defecto")
        escenas.insert(0, {"id": "portada", "tipo": "portada", "titulo": "Compras en|Deister Axional VNext",
                           "subtitulo": "Tutorial paso a paso para empezar desde cero", "etiqueta": "O&S Consultores",
                           "narracion": "Hola, bienvenidos a O&S Consultores. En este tutorial vas a aprender, paso a paso, "
                                        "a hacer compras en Deister Axional VNext."})
    if not any(e["tipo"] == "cierre" for e in escenas):
        aviso("sin cierre: añado uno por defecto")
        escenas.append({"id": "cierre", "tipo": "cierre", "titulo": "Gracias por acompañarnos",
                        "subtitulo": "Compras en Deister Axional VNext · O&S Consultores",
                        "narracion": "Esto es todo. Gracias por acompañarnos. Nos vemos en el próximo tutorial de O&S Consultores."})
    # ids únicos
    vistos = set()
    for e in escenas:
        if e["id"] in vistos:
            aviso(f"id repetido: {e['id']}")
        vistos.add(e["id"])
        if e["tipo"] == "comparativa":
            aviso(f"{e['id']}: escena «comparativa» (prohibida en la v2)")
        for t in textos(e):
            for pat in PROHIBIDAS:
                m = re.search(pat, t, flags=re.I)
                if m:
                    aviso(f"{e['id']}: palabra prohibida «{m.group(0)}» en «…{t[max(0, m.start() - 40):m.end() + 40]}…»")
    return escenas


def aplicar_sync(guion):
    """Aplica a cada pantalla lo calculado por --clips (si su voz y grabación no han cambiado)."""
    if not SYNC.exists():
        return guion
    sync = cargar(SYNC)
    for e in guion["escenas"]:
        s = sync.get(e["id"])
        if e["tipo"] != "pantalla" or not s:
            continue
        if s.get("narracion") != (e.get("narracion") or "").strip():
            aviso(f"{e['id']}: la narración cambió desde el último --clips; vuelve a ejecutar voz.py y --clips")
            continue
        for k in ("video", "tamano", "clipDesde", "clipDur", "duracion"):
            if k in s:
                e[k] = s[k]
        if s.get("huecos"):
            e["huecos"] = s["huecos"]
        if s.get("tapas"):
            e["tapas"] = s["tapas"]
        for k in ("zooms", "callouts", "resaltes", "foco"):
            if s.get(k) and not s.get(f"manual_{k}"):
                e[k] = s[k]
    return guion


# ---------------------------------------------------------------- 2) clips sincronizados
def contar_frames(webm: Path) -> int:
    out = subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries",
                          "stream=nb_read_packets", "-of", "csv=p=0", str(webm)], capture_output=True, text=True).stdout
    return int(out.strip().split(",")[0])


def grupos(eventos):
    """Agrupa los eventos por acción (un «move» abre acción nueva) y devuelve las anclas con clave."""
    acts, cur = [], []
    for ev in eventos:
        if ev["tipo"] in ("start", "stop"):
            continue
        nueva = ev["tipo"] in ("move", "goto", "pause", "scroll", "mark") or (
            ev["tipo"] in ("key",) and cur and cur[-1]["tipo"] != "type") or (
            cur and ev.get("clave") != cur[-1].get("clave"))
        if nueva and cur:
            acts.append(cur)
            cur = []
        cur.append(ev)
    if cur:
        acts.append(cur)
    return acts


def ancla_de(act):
    """Evento que debe caer en la palabra clave y su instante en el vídeo original."""
    for ev in act:
        if ev["tipo"] in ("click", "resalta", "fill", "key", "scroll"):
            return ev, ev["t"]
        if ev["tipo"] == "type":
            return ev, ev.get("desde", ev["t"])
    return None, None


def plan_tiempos(anclas, total_src, vmax=lambda a, b: VEL_MAX):
    """anclas: [(s, d, fp, wv)] instante en el vídeo original, instante deseado en el clip (sin huecos), punto de
    congelado y punto de la voz (s) donde se puede insertar un silencio antes de la palabra clave.
    Si el vídeo va por delante, congela; si va por detrás, acelera hasta vmax(s0, s1) (3× cursor/espera, 2× tecleo) y,
    si aun así llega tarde, la VOZ espera: se inserta un hueco de silencio antes de la palabra.
    Devuelve (tramos [(out0, out1, src0, src1)] (src0 == src1 → congelado), huecos [{s, ms}])."""
    tramos, huecos = [], []
    cur = 0.0
    s_prev = 0.0
    shift = 0.0
    for s, d0, fp, wv in anclas:
        if s <= s_prev:
            continue
        d = d0 + shift
        ds = s - s_prev
        disp = d - cur
        vm = vmax(s_prev, s)
        if disp >= ds:
            fp = min(max(fp, s_prev), s)
            if fp > s_prev:
                tramos.append((cur, cur + fp - s_prev, s_prev, fp))
                cur += fp - s_prev
            espera = disp - ds
            if espera > 1e-3:
                tramos.append((cur, cur + espera, fp, fp))
                cur += espera
            tramos.append((cur, cur + s - fp, fp, s))
            cur += s - fp
        else:
            dur = max(ds / vm, disp)
            tramos.append((cur, cur + dur, s_prev, s))
            cur += dur
            tarde = cur - d
            if tarde > 0.04:
                ms = int(round(tarde * 1000 + 40))
                huecos.append({"s": round(wv, 3), "ms": ms})
                shift += ms / 1000
        s_prev = s
    if total_src > s_prev:
        tramos.append((cur, cur + total_src - s_prev, s_prev, total_src))
    return tramos, huecos


def src_a_out(tramos, s, ultimo=False):
    """Instante de salida en que se ve el instante «s» del original: la primera vez o, con «ultimo», la última
    (tras un congelado; para el arranque de un movimiento del cursor)."""
    res = None
    for o0, o1, s0, s1 in tramos:
        if s1 > s0 and s0 - 1e-6 <= s <= s1 + 1e-6:
            res = o0 + (s - s0) * (o1 - o0) / (s1 - s0)
            if not ultimo:
                break
    if res is None:
        res = tramos[-1][1] if s > tramos[-1][3] else 0.0
    return res


def out_a_src(tramos, o):
    for o0, o1, s0, s1 in tramos:
        if o0 - 1e-9 <= o < o1:
            return s0 if s1 == s0 else s0 + (o - o0) * (s1 - s0) / (o1 - o0)
    return tramos[-1][3]


def render_clip(webm: Path, mp4: Path, tramos, n_src: int, res_w: int):
    res_h = round(res_w * SRC_H / SRC_W / 2) * 2
    total = tramos[-1][1]
    n_out = max(1, round(total * FPS))
    fsize = res_w * res_h * 3 // 2
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(webm), "-vf", f"scale={res_w}:{res_h}:flags=lanczos",
                            "-fps_mode", "passthrough", "-pix_fmt", "yuv420p", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    mp4.parent.mkdir(parents=True, exist_ok=True)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "yuv420p", "-s", f"{res_w}x{res_h}",
                            "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-tune", "stillimage",
                            "-g", str(FPS), "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(mp4)], stdin=subprocess.PIPE)
    idx, frame = -1, None
    for j in range(n_out):
        want = min(n_src - 1, max(0, round(out_a_src(tramos, j / FPS) * FPS)))
        while idx < want:
            buf = dec.stdout.read(fsize)
            if len(buf) < fsize:
                want = idx  # se acabó el vídeo: repite el último
                break
            frame, idx = buf, idx + 1
        enc.stdin.write(frame)
    enc.stdin.close()
    dec.stdout.close()
    dec.wait()
    enc.wait()
    return n_out / FPS


def R2(r):
    """rect CSS [x,y,w,h] → rect de escena (px 3200×1800)."""
    return {"x": round(r[0] * 2), "y": round(r[1] * 2), "w": round(r[2] * 2), "h": round(r[3] * 2)}


def rect_zoom(r, zmax=1.55):
    """Ventana 16:9 centrada en el rect (en px de escena) para un zoom de como mucho «zmax»."""
    w = max(r["w"] * 1.8, SRC_W / zmax, r["h"] * 1.8 * 16 / 9)
    h = w * 9 / 16
    cx, cy = r["x"] + r["w"] / 2, r["y"] + r["h"] / 2
    return {"x": round(cx - w / 2), "y": round(cy - h / 2), "w": round(w), "h": round(h)}


def pequeno(r):
    return r[2] * r[3] < 300 * 44 or (r[3] <= 44 and r[2] <= 360)


def efectos(eventos, tramos, desde, off):
    """Zooms, resaltes, callouts y focos en segundos de escena."""
    T = lambda t, u=False: round(desde + src_a_out(tramos, t + off, u), 2)  # noqa: E731
    resaltes, callouts, foco, zonas = [], [], [], []
    acts = grupos(eventos)
    for act in acts:
        clave = act[0].get("clave")
        mv = next((e for e in act if e["tipo"] == "move"), None)
        ck = next((e for e in act if e["tipo"] == "click"), None)
        ty = next((e for e in act if e["tipo"] == "type"), None)
        fl = next((e for e in act if e["tipo"] == "fill"), None)
        rs = next((e for e in act if e["tipo"] == "resalta"), None)
        if rs and rs.get("rect"):
            t0 = T(rs["t"])
            t1 = max(T(rs["t"] + rs.get("ms", 2500) / 1000), t0 + 2.5)
            if rs.get("texto"):
                callouts.append({"t": t0, "rect": R2(rs["rect"]), "texto": rs["texto"], "hasta": t1})
            else:
                resaltes.append({"t": t0, "rect": R2(rs["rect"]), "hasta": t1})
            if pequeno(rs["rect"]) and clave:
                zonas.append((t0 - 0.9, t1, R2(rs["rect"])))
        elif (ty or fl) and (ck or fl):
            r = (fl or ck).get("rect")
            if r:
                t0 = T((ck or fl)["t"])
                t1 = T(ty["t"]) + 0.8 if ty else t0 + 2.5
                resaltes.append({"t": t0, "rect": R2(r), "hasta": max(t1, t0 + 1.5), "oscurece": False})
                if clave:
                    zonas.append((t0 - 0.9, t1, R2(r)))
        elif ck and ck.get("rect"):
            r = ck["rect"]
            tc = T(ck["t"])
            foco.append({"t": tc, "x": round((r[0] + r[2] / 2) * 2), "y": round((r[1] + r[3] / 2) * 2), "hasta": round(tc + 1.2, 2)})
            if clave:  # clic importante: además, resalta el elemento un momento
                resaltes.append({"t": round(tc - 0.2, 2), "rect": R2(r), "hasta": round(tc + 2.2, 2), "oscurece": False})
            if clave and pequeno(r):
                tm = T(mv["t"], True) if mv else tc - 0.9
                zonas.append((min(tm, tc - 0.6) - 0.3, tc + 2.2, R2(r)))
    # zooms: une zonas que se solapan o están cerca y caben juntas; vuelve al plano general entre grupos separados
    zonas.sort(key=lambda z: z[0])
    merged = []
    for a, b, r in zonas:
        if merged:
            pa, pb, pr = merged[-1]
            ux0, uy0 = min(pr["x"], r["x"]), min(pr["y"], r["y"])
            ux1, uy1 = max(pr["x"] + pr["w"], r["x"] + r["w"]), max(pr["y"] + pr["h"], r["y"] + r["h"])
            if a <= pb + 1.5 and (ux1 - ux0) <= SRC_W / 1.3 and (uy1 - uy0) <= SRC_H / 1.3:
                merged[-1] = (pa, max(pb, b), {"x": ux0, "y": uy0, "w": ux1 - ux0, "h": uy1 - uy0})
                continue
        merged.append((a, b, r))
    zooms = []
    for i, (a, b, r) in enumerate(merged):
        if zooms and "rect" in zooms[-1]:
            pr = merged[i - 1][2]
            lejos = abs((pr["x"] + pr["w"] / 2) - (r["x"] + r["w"] / 2)) > SRC_W * 0.45 or abs((pr["y"] + pr["h"] / 2) - (r["y"] + r["h"] / 2)) > SRC_H * 0.45
            if lejos:  # entre dos zonas alejadas, pasa por el plano general
                vuelta = max(zooms[-1]["t"] + 1.5, min(merged[i - 1][1], a - 1.1))
                zooms.append({"t": round(vuelta, 2), "dur": 1.0})
                a = max(a, vuelta + 1.0)
        zooms.append({"t": round(max(desde, a), 2), "rect": rect_zoom(r), "dur": 1.0})
        sig = merged[i + 1][0] if i + 1 < len(merged) else None
        if sig is None or sig - b > 1.5:
            zooms.append({"t": round(b, 2), "dur": 1.1})
    return {"zooms": zooms, "resaltes": resaltes, "callouts": callouts, "foco": foco}


def clips(guion, timing, solo, force, res_w):
    sync = cargar(SYNC) if SYNC.exists() else {}
    cfg = guion.get("config", {})
    entrada = cfg.get("entrada", 0.6)
    colchon_g = cfg.get("colchon", 1.3)
    pcap = cfg.get("pausaCapitulo", 1.2)
    esc = guion["escenas"]
    hechos = set()
    for n, e in enumerate(esc):
        if e["tipo"] != "pantalla" or (solo and e["id"] not in solo):
            continue
        eid = e["id"]
        webm, log = REC / f"{eid}.webm", REC / f"{eid}.json"
        if not webm.exists() or not log.exists():
            aviso(f"{eid}: sin grabación rec/{eid}.webm + .json")
            continue
        tm = timing.get(eid)
        narr = (e.get("narracion") or "").strip()
        if narr and not tm:
            aviso(f"{eid}: sin voz en timing.json (ejecuta voz.py)")
            continue
        words = tm["words"] if tm else []
        voz_s = tm["durMs"] / 1000 if tm else 0
        h = hashlib.sha1((log.read_text() + json.dumps(words) + str(webm.stat().st_size) + f"|{res_w}|{entrada}|v5").encode()).hexdigest()[:16]
        mp4 = CLIPS / f"{eid}.mp4"
        prev = sync.get(eid)
        print(f"== {eid}")
        eventos = cargar(log)["eventos"]
        n_src = contar_frames(webm)
        total_src = n_src / FPS
        t_stop = next((x["t"] for x in eventos if x["tipo"] == "stop"), total_src)
        off = min(max(total_src - (t_stop + 0.5), 0.0), 0.5)
        # anclas
        anclas, cursor = [], 0
        acts = grupos(eventos)
        for ai, act in enumerate(acts):
            clave = act[0].get("clave")
            ev, s = ancla_de(act)
            if ev is None:
                continue
            if not clave and ev["tipo"] != "scroll":
                continue
            if clave:
                idx = find_clave(words, clave, cursor)
                if idx < 0:
                    aviso(f"{eid}: clave «{clave}» no aparece en la voz (después de la palabra {cursor})")
                    continue
            else:
                # scroll sin clave: primera «baja / más abajo / bajamos…» antes de la siguiente clave
                tope = len(words)
                for nx in acts[ai + 1:]:
                    nc = nx[0].get("clave")
                    if nc and ancla_de(nx)[0] is not None:
                        j = find_clave(words, nc, cursor)
                        if j >= 0:
                            tope = j
                        break
                idx = next((i for i in range(cursor, tope) if norm(words[i]["w"]).startswith(PALABRAS_SCROLL)), -1)
                if idx < 0:
                    continue
                clave = words[idx]["w"]
            prev_idx = cursor - 1
            cursor = idx + 1
            d = entrada + words[idx]["o"] / 1000 - CLIP_DESDE - ANTICIPO
            mv = next((x for x in act if x["tipo"] == "move"), None)
            fp = (mv["t"] if mv else s - 0.5) + off
            # punto de la voz donde cabe un silencio: el límite de frase (punto, coma…) más cercano antes de la palabra
            # clave y después de la anterior; si no hay, la pausa justo antes de la palabra
            o = words[idx]["o"] / 1000
            # (la palabra de la ancla anterior también vale: el silencio va justo detrás de ella)
            j = next((k for k in range(idx - 1, max(prev_idx - 1, -1), -1) if re.search(r"[.,;:!?…»]$", words[k]["w"])), None)
            if j is not None:
                fin_j = (words[j]["o"] + words[j]["d"]) / 1000
                wv = (fin_j + words[j + 1]["o"] / 1000) / 2
            else:
                pe = (words[idx - 1]["o"] + words[idx - 1]["d"]) / 1000 if idx > 0 else max(0.0, o - 0.1)
                wv = (min(pe, o) + o) / 2 if o - pe > 0.02 else max(0.0, o - 0.01)
            anclas.append((s + off, d, fp, wv))
            print(f"   ancla «{clave}»{' (scroll)' if ev['tipo'] == 'scroll' else ''}: vídeo {s + off:6.2f}s → clip {d:6.2f}s (palabra «{words[idx]['w']}»)")
        teclas = [(x.get("desde", x["t"]) + off, x["t"] + off) for x in eventos if x["tipo"] == "type"]

        def vmax(a, b):
            return VEL_TECLEO if any(t0 < b and t1 > a for t0, t1 in teclas) else VEL_MAX

        tramos, huecos = plan_tiempos(anclas, total_src, vmax)
        hueco_s = sum(h["ms"] for h in huecos) / 1000
        for hh in huecos:
            aviso(f"{eid}: la voz espera {hh['ms']} ms en {hh['s']:.2f}s (el vídeo no llega ni a {VEL_MAX:g}×/{VEL_TECLEO:g}×)")
        # congelado final largo: ralentiza el tramo final (después de la última acción) hasta 0,6×
        fin_voz = entrada + voz_s + hueco_s - CLIP_DESDE
        cong = fin_voz - tramos[-1][1]
        if cong > CONGELADO_MAX and tramos[-1][3] > tramos[-1][2]:
            o0, o1, s0, s1 = tramos[-1]
            extra = min(cong - 1.0, (o1 - o0) / VEL_LENTA - (o1 - o0))
            if extra > 0.05:
                tramos[-1] = (o0, o1 + extra, s0, s1)
                print(f"   final ralentizado {o1 - o0:.1f}s → {o1 - o0 + extra:.1f}s (congelado {cong:.1f}s → {cong - extra:.1f}s)")
        if force or not prev or prev.get("hash") != h or not mp4.exists():
            dur = render_clip(webm, mp4, tramos, n_src, res_w)
            print(f"   clip {mp4.name}: {total_src:.1f}s → {dur:.1f}s ({res_w}px)")
        else:
            dur = prev["clipDur"]
            print(f"   = clip sin cambios ({dur:.1f}s)")
        fx = efectos(eventos, tramos, CLIP_DESDE, off)
        # si aún queda un congelado largo, que la imagen no se quede muerta: zoom lento al último resalte o vuelta suave
        cong = fin_voz - dur
        if cong > CONGELADO_MAX and not e.get("zooms"):
            F = CLIP_DESDE + dur
            zs = fx["zooms"]
            t0 = max(F + 0.3, max((z["t"] + z.get("dur", 1.0) + 0.2 for z in zs), default=0))
            durz = round(min(6.0, max(2.0, CLIP_DESDE + fin_voz - t0 - 0.5)), 2)
            if zs and "rect" in zs[-1]:
                zs.append({"t": round(t0, 2), "dur": durz})
                print(f"   congelado {cong:.1f}s: vuelta lenta al plano general")
            else:
                marcas_prev = [m for m in fx["resaltes"] + fx["callouts"] if m["t"] <= F]
                if marcas_prev:
                    r = max(marcas_prev, key=lambda m: m["t"])["rect"]
                    zs.append({"t": round(t0, 2), "rect": rect_zoom(r, 1.3), "dur": durz})
                    print(f"   congelado {cong:.1f}s: zoom lento hacia el último resalte")
        # tapas (tapas.json): fotogramas del webm → segundos de escena
        tapas_cfg = (cargar(TAPAS) if TAPAS.exists() else {}).get(eid, [])
        tapas = []
        for tp in tapas_cfg:
            t = {k: v for k, v in tp.items() if k not in ("desdeFrame", "hastaFrame")}
            if "desdeFrame" in tp:
                t["desde"] = round(CLIP_DESDE + src_a_out(tramos, tp["desdeFrame"] / FPS), 3)
            if "hastaFrame" in tp:
                t["hasta"] = round(CLIP_DESDE + src_a_out(tramos, tp["hastaFrame"] / FPS, True), 3)
            tapas.append(t)
        if tapas:
            fx["tapas"] = tapas
            print(f"   {len(tapas)} tapa(s) desde {tapas[0].get('desde', 0):.2f}s")
        sig = esc[n + 1] if n + 1 < len(esc) else None
        voz_tot = entrada + voz_s + hueco_s + e.get("colchon", colchon_g) + e.get("pausa", 0) + (pcap if sig and sig["tipo"] == "capitulo" else 0)
        duracion = round(max(voz_tot, CLIP_DESDE + dur + MARGEN_FIN), 2)
        s = {"hash": h, "narracion": narr, "video": f"clips/{eid}.mp4", "tamano": {"w": SRC_W, "h": SRC_H},
             "clipDesde": CLIP_DESDE, "clipDur": round(dur, 3), "duracion": duracion, "huecos": huecos, **fx}
        for k in ("zooms", "callouts", "resaltes", "foco"):
            if e.get(k):
                s[f"manual_{k}"] = True   # la escena trae los suyos (del capNN.json): se respetan
        sync[eid] = s
        hechos.add(eid)
        print(f"   duración {duracion:.1f}s (voz {voz_s:.1f}s + huecos {hueco_s:.1f}s) · {len(fx['zooms'])} zooms, {len(fx['resaltes'])} resaltes, "
              f"{len(fx['callouts'])} callouts, {len(fx['foco'])} focos")
    # otros agentes pueden estar escribiendo sync.json a la vez: relee y cambia solo lo hecho aquí
    actual = cargar(SYNC) if SYNC.exists() else {}
    actual.update({k: sync[k] for k in hechos})
    guardar(SYNC, actual)


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--clips", action="store_true")
    ap.add_argument("--entrada")
    ap.add_argument("--salida", default=str(DATA / "guion.json"))
    ap.add_argument("--solo", default="")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--res", type=int, default=2560)
    a = ap.parse_args()
    salida = Path(a.salida)

    if a.entrada:
        fuentes = [Path(a.entrada)]
    else:
        fuentes = sorted(V2.glob("cap[0-9][0-9].json"), key=lambda p: int(p.stem[3:]))
    if not fuentes:
        aviso("no hay capNN.json en v2/ (ni --entrada): guion provisional solo con portada y cierre")
    print("fuentes:", ", ".join(f.name for f in fuentes))
    escenas = unir(fuentes)
    guion = {"titulo": TITULO, "config": json.loads(json.dumps(CONFIG)), "escenas": escenas}

    if a.clips:
        tpath = DATA / "timing.json"
        timing = cargar(tpath) if tpath.exists() else {}
        clips(guion, timing, {x for x in a.solo.split(",") if x}, a.force, a.res)

    guion = aplicar_sync(guion)
    guardar(salida, guion)
    tipos = {}
    for e in escenas:
        tipos[e["tipo"]] = tipos.get(e["tipo"], 0) + 1
    pal = sum(len((e.get("narracion") or "").split()) for e in escenas)
    print(f"{salida.name}: {len(escenas)} escenas {tipos} · {pal} palabras (≈ {pal / 2.3 / 60:.1f} min de voz)")


if __name__ == "__main__":
    main()
