#!/usr/bin/env python3
"""Recorta las esperas muertas de una grabación de rec.mjs (la demo sondea la red y cada clic esperaba ~9 s).

Uso: python3 recorta.py <id> [<id> …] [--keep 2.5]
- Guarda una vez el original como rec/<id>.orig.webm / .orig.json y trabaja siempre desde él (reejecutable).
- Tras un click/pick/scroll/key/goto, si el siguiente evento llega más de keep+0.8 s después, quita el tramo
  [t+keep, t_sig-0.4]. Reloj del webm: fotograma/30 (como gen_v2.py).
- Reescribe rec/<id>.webm (H.264 en Matroska, un paquete por fotograma) y rec/<id>.json con los tiempos movidos.
"""
import json, shutil, subprocess, sys
from pathlib import Path

REC = Path(__file__).resolve().parent.parent / "rec"
FPS = 30
CORTABLES = {"click", "pick", "scroll", "key", "goto", "dbl", "dblclick"}


def recorta(eid, keep):
    webm, js = REC / f"{eid}.webm", REC / f"{eid}.json"
    owebm, ojs = REC / f"{eid}.orig.webm", REC / f"{eid}.orig.json"
    if not owebm.exists():
        shutil.copy2(webm, owebm); shutil.copy2(js, ojs)
    d = json.loads(ojs.read_text())
    ev = d["eventos"]
    cortes = []
    for a, b in zip(ev, ev[1:]):
        if a.get("tipo") in CORTABLES and b["t"] - a["t"] > keep + 0.8:
            cortes.append((a["t"] + keep, b["t"] - 0.4))
    if not cortes:
        print(eid, "sin cortes"); return
    quitado = lambda t: sum(min(t, c1) - c0 for c0, c1 in cortes if t > c0)
    for e in ev:
        e["t"] = round(e["t"] - quitado(e["t"]), 3)
    expr = "+".join(f"between(n,{round(c0*FPS)},{round(c1*FPS)})" for c0, c1 in cortes)
    tmp = REC / f"{eid}.tmp.mkv"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(owebm), "-vf", f"select='not({expr})',setpts=N/{FPS}/TB",
                    "-fps_mode", "passthrough", "-c:v", "libx264", "-preset", "veryfast", "-crf", "12", "-an",
                    "-f", "matroska", str(tmp)], check=True)
    tmp.replace(webm)
    js.write_text(json.dumps(d, ensure_ascii=False, indent=1))
    tot = sum(c1 - c0 for c0, c1 in cortes)
    print(f"{eid}: {len(cortes)} cortes, {tot:.1f} s quitados ({ev[-1]['t']:.1f} s quedan)")


if __name__ == "__main__":
    args = sys.argv[1:]
    keep = 2.5
    if "--keep" in args:
        i = args.index("--keep"); keep = float(args[i + 1]); del args[i:i + 2]
    for eid in args:
        recorta(eid, keep)
