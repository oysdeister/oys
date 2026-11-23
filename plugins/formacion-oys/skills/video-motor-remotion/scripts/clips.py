#!/usr/bin/env python3
"""Recorta los clips del guion.

Por cada escena con  "clip": {"src": ..., "inicio": s, "fin": s}  crea
video/public/clips/<id>.mp4 (H.264, sin audio, 30 fps, yuv420p).
«src» puede ser absoluto o relativo a la carpeta video/.
Solo recorta de nuevo si cambian src/inicio/fin (marca en <id>.json).

Uso:  python3 tools/clips.py [--force]
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
import os
VIDEO = Path(os.environ.get("VIDEO_DIR", BASE / "video")).resolve()  # carpeta de la plantilla Remotion
GUION = VIDEO / "src" / "data" / "guion.json"
CLIPS = VIDEO / "public" / "clips"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    guion = json.loads(GUION.read_text(encoding="utf-8"))
    CLIPS.mkdir(parents=True, exist_ok=True)
    for esc in guion["escenas"]:
        clip = esc.get("clip")
        if not clip:
            continue
        eid = esc["id"]
        src = Path(clip["src"])
        if not src.is_absolute():
            src = (VIDEO / src).resolve()
        if not src.exists():
            sys.exit(f"{eid}: no existe {src}")
        ini, fin = float(clip["inicio"]), float(clip["fin"])
        out = CLIPS / f"{eid}.mp4"
        marca = CLIPS / f"{eid}.json"
        firma = {"src": str(src), "inicio": ini, "fin": fin}
        if not args.force and out.exists() and marca.exists() and json.loads(marca.read_text()) == firma:
            print(f"  = {eid} (sin cambios)")
            continue
        print(f"  > {eid}: {src.name} {ini}-{fin} s")
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-ss", str(ini), "-i", str(src), "-t", str(fin - ini),
            "-an", "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "16",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out),
        ], check=True)
        marca.write_text(json.dumps(firma))
    print("clips listos")


if __name__ == "__main__":
    main()
