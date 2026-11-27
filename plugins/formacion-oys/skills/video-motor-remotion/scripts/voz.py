#!/usr/bin/env python3
"""Genera la locución del guion con edge-tts.

Lee video/src/data/guion.json y, por cada escena con «narracion», crea
  video/public/audio/<id>.mp3          (voz)
  video/public/audio/<id>.words.json   ([{w, o, d}] palabra, offset ms, duración ms)
y escribe video/src/data/timing.json  {id: {durMs, hash, words}}.

Solo regenera una escena si cambia su texto, voz o rate (hash).

Uso:  tools/.venv/bin/python tools/voz.py [--force] [--solo id1,id2]
"""
import argparse
import asyncio
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

BASE = Path(__file__).resolve().parent.parent
import os
VIDEO = Path(os.environ.get("VIDEO_DIR", BASE / "video")).resolve()  # carpeta de la plantilla Remotion
GUION = VIDEO / "src" / "data" / "guion.json"
TIMING = VIDEO / "src" / "data" / "timing.json"
AUDIO = VIDEO / "public" / "audio"

VOZ_DEFECTO = "es-ES-XimenaNeural"
RATE_DEFECTO = "+0%"


def ffprobe_ms(path: Path) -> int:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return int(round(float(out) * 1000))


def alinear(texto: str, words: list) -> list:
    """Sustituye cada palabra de WordBoundary por el token del texto original
    (con su puntuación pegada: «albarán,» «¿Sabes»), para los subtítulos."""
    pos = 0
    res = []
    for w in words:
        raw = w["w"]
        i = texto.find(raw, pos)
        if i < 0:
            i = texto.lower().find(raw.lower(), pos)
        if i < 0:
            res.append(w)
            continue
        ini = i
        while ini > pos and not texto[ini - 1].isspace():
            ini -= 1
        fin = i + len(raw)
        # pega la puntuación que sigue, sin comerse la palabra siguiente
        while fin < len(texto) and not texto[fin].isspace() and not texto[fin].isalnum():
            fin += 1
        tok = texto[ini:fin].strip()
        res.append({**w, "w": tok or raw})
        pos = fin
    return res


async def sintetizar(texto: str, voz: str, rate: str, mp3: Path) -> list:
    com = edge_tts.Communicate(texto, voz, rate=rate, boundary="WordBoundary")
    words = []
    with open(mp3, "wb") as f:
        async for chunk in com.stream():
            t = chunk.get("type")
            if t == "audio":
                f.write(chunk["data"])
            elif t == "WordBoundary":
                words.append({
                    "w": chunk["text"],
                    "o": int(round(chunk["offset"] / 10_000)),
                    "d": int(round(chunk["duration"] / 10_000)),
                })
    return words


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="regenera todo")
    ap.add_argument("--solo", default="", help="ids separados por comas")
    args = ap.parse_args()

    guion = json.loads(GUION.read_text(encoding="utf-8"))
    cfg = guion.get("config", {})
    voz_g = cfg.get("voz", VOZ_DEFECTO)
    rate_g = cfg.get("rate", RATE_DEFECTO)
    solo = {s for s in args.solo.split(",") if s}

    AUDIO.mkdir(parents=True, exist_ok=True)
    timing = json.loads(TIMING.read_text(encoding="utf-8")) if TIMING.exists() else {}
    nuevo = {}

    for esc in guion["escenas"]:
        eid = esc["id"]
        texto = (esc.get("narracion") or "").strip()
        if not texto:
            continue
        texto = re.sub(r"\s+", " ", texto)
        voz = esc.get("voz", voz_g)
        rate = esc.get("rate", rate_g)
        h = hashlib.sha1(f"{voz}|{rate}|{texto}".encode()).hexdigest()[:16]
        mp3 = AUDIO / f"{eid}.mp3"
        wj = AUDIO / f"{eid}.words.json"
        prev = timing.get(eid)
        if (not args.force and (not solo or eid not in solo) and prev and prev.get("hash") == h
                and mp3.exists() and wj.exists()):
            nuevo[eid] = prev
            print(f"  = {eid} (sin cambios)")
            continue
        print(f"  > {eid}: generando ({voz}, {rate})…", flush=True)
        for intento in range(3):
            try:
                words = asyncio.run(sintetizar(texto, voz, rate, mp3))
                break
            except Exception as e:  # red inestable
                print(f"    reintento {intento + 1}: {e}", file=sys.stderr)
        else:
            sys.exit(f"No se pudo sintetizar {eid}")
        if not words:
            print(f"    aviso: {eid} sin WordBoundary (¿versión de edge-tts?)", file=sys.stderr)
        words = alinear(texto, words)
        dur = ffprobe_ms(mp3)
        wj.write_text(json.dumps(words, ensure_ascii=False, indent=0), encoding="utf-8")
        nuevo[eid] = {"durMs": dur, "hash": h, "words": words}
        print(f"    {dur} ms, {len(words)} palabras")

    TIMING.write_text(json.dumps(nuevo, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"timing.json: {len(nuevo)} escenas, {sum(v['durMs'] for v in nuevo.values()) / 1000:.1f} s de voz")


if __name__ == "__main__":
    main()
