#!/usr/bin/env python3
"""Tramos de fotogramas de rec/<id>.webm en que la zona x,y,w,h (px 3200×1800) es igual que en el fotograma de referencia.
Uso: python3 tools/busca_tapa.py c5-validar 930,140,390,60 600     → [(212, 1481)] = desdeFrame/hastaFrame para tapas.json
     python3 tools/busca_tapa.py c6-lineas 2280,1305,200,48 c6-cabecera:600   (referencia tomada de otra grabación)"""
import subprocess
import sys
from pathlib import Path

eid, zona, ref = sys.argv[1], sys.argv[2], sys.argv[3]
x, y, w, h = (int(v) for v in zona.split(","))
REC = Path(__file__).resolve().parent.parent / "rec"


def fotogramas(i):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(REC / f"{i}.webm"), "-vf", f"crop={w}:{h}:{x}:{y}", "-fps_mode",
                          "passthrough", "-pix_fmt", "gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    return [raw[k * w * h:(k + 1) * w * h] for k in range(len(raw) // (w * h))]


fr = fotogramas(eid)
n = len(fr)
if ":" in ref:
    rid, rf = ref.split(":")
    r = fotogramas(rid)[int(rf)][::7]
    ref = ref
else:
    r = fr[int(ref)][::7]
igual = [sum(abs(a - b) for a, b in zip(f[::7], r)) / len(r) < 4 for f in fr]
tramos, s = [], None
for i, v in enumerate(igual + [False]):
    if v and s is None:
        s = i
    if not v and s is not None:
        tramos.append((s, i - 1))
        s = None
print(f"{n} fotogramas · tramos iguales a {ref}: {tramos}")
