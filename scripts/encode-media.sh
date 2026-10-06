#!/usr/bin/env bash
# A media/raw/ nyers fal.ai kimeneteiből web-optimalizált fájlokat készít a public/media/ mappába.
# Használat: npm run media:encode [-- stills|video]
set -euo pipefail
RAW=media/raw; OUT=public/media; mkdir -p "$OUT"
MODE="${1:-all}"

if [[ "$MODE" == all || "$MODE" == stills ]]; then
  # Állóképek: max 2000px hosszabb oldal, JPEG (next/image tovább optimalizál)
  for n in anya-baba tancolo-evek; do
    ffmpeg -loglevel error -y -i "$RAW/$n.jpg" -vf "scale='if(gt(iw,ih),2000,-2)':'if(gt(iw,ih),-2,2000)'" -q:v 4 "$OUT/$n.jpg"
  done
  # A "hanna" nyers képének fekete/fehér kerete van: vágás, majd méretezés
  ffmpeg -loglevel error -y -i "$RAW/hanna.jpg" -vf "crop=iw*0.93:ih*0.955:iw*0.025:ih*0.02,scale=-2:2000" -q:v 4 "$OUT/hanna.jpg"
fi

if [[ "$MODE" == all || "$MODE" == video ]]; then
  # Videó: hang nélkül, 1280 széles, web-optimalizált
  ffmpeg -loglevel error -y -i "$RAW/hero.mp4" -an -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -crf 28 -preset slow -movflags +faststart "$OUT/hero.mp4"
  ffmpeg -loglevel error -y -i "$RAW/hero.mp4" -an -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 "$OUT/hero.webm"
  ffmpeg -loglevel error -y -i "$OUT/hero.mp4" -frames:v 1 -q:v 3 "$OUT/hero-poster.jpg"
  for f in "$OUT/hero.mp4" "$OUT/hero.webm"; do
    size=$(stat -f%z "$f")
    [ "$size" -le 3145728 ] || { echo "TÚL NAGY: $f ($size bájt)"; exit 1; }
  done
fi

ls -lh "$OUT"
