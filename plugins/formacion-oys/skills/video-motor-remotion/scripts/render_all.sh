#!/bin/zsh
# Renderiza por capítulos (salta los ya hechos) y concatena.
# uso: render_all.sh <carpeta video/> <salida.mp4> [n.º de capítulos, por defecto 9]
set -e
V="${1:?carpeta video}"; SAL="${2:?salida.mp4}"; N="${3:-9}"
cd "$V"; C="out/caps"; mkdir -p "$C"; : > "$C/lista.txt"
for i in $(seq -f "%02g" 1 $N); do
  f="$C/cap$i.mp4"
  if [ ! -s "$f" ]; then echo "== Cap-$i $(date +%T)"; npx remotion render "Cap-$i" "$f" --log=error; fi
  echo "file 'cap$i.mp4'" >> "$C/lista.txt"
done
ffmpeg -y -loglevel error -f concat -safe 0 -i "$C/lista.txt" -c copy "$SAL"
echo "== FIN $(date +%T)"; ffprobe -v error -show_entries format=duration -of csv=p=0 "$SAL"
