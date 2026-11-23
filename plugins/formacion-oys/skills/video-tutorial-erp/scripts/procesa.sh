#!/bin/zsh
# uso: tools/procesa.sh <id> <alias>   → media/<alias>/{audio.wav, transcript.*, frames/}
set -e
R="${0:A:h}/.."; id=$1; a=$2; S="$R/media/src/$id.mp4"; O="$R/media/$a"; mkdir -p "$O/frames"
ffmpeg -v error -y -i "$S" -ar 16000 -ac 1 -c:a pcm_s16le "$O/audio.wav"
whisper-cli -m "$R/models/ggml-large-v3-turbo.bin" -l es -t 8 -ovtt -osrt -oj -of "$O/transcript" --prompt "Tutorial de ERP: compras, pedidos, albaranes, facturas, tarifas, delegación, proveedor, serie, máscara, workflow, CRC." "$O/audio.wav" >/dev/null 2>"$O/whisper.log"
# un fotograma cada 10 s (para que los agentes vean la pantalla)
ffmpeg -v error -y -i "$S" -vf "fps=1/10,scale=1280:-2" -q:v 3 "$O/frames/f_%05d.jpg"
echo "hecho $a"
