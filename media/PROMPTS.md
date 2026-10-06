# Generált média – promptok

Generálva: 2026-10-06, `scripts/generate-media.mjs` (fal.ai). A nyers fájlok a `media/raw/`-ban (gitignored), a véglegesek a `public/media/`-ban (`scripts/encode-media.sh`).

Közös stílus (`${STYLE}`):

> editorial documentary photograph, natural window light, warm cream, terracotta and honey wood tones, soft film grain, 35mm lens, no text, no logos, no watermark

## Állóképek – `fal-ai/nano-banana-pro` (2K, jpeg)

### hero-still (16:9)

> Wide shot of a sunlit dance studio with tall windows and a honey-coloured wooden floor. A woman dancer in soft neutral clothing, seen from the side at mid distance, face turned away and not recognisable, mid-way through a slow, graceful arm sweep. She stands in the right third of the frame; the left half is calm empty space with soft light. ${STYLE}

fal URL: https://v3b.fal.media/files/b/0aad4a38/Sb1SJBa_YSTmIg5A8Xo_i_Vl1E5liP.jpg

### anya-baba (4:5)

> A mother dancing joyfully in a bright studio while carrying her baby in a blush-pink woven wrap carrier, the baby safely snug on her chest, mother's face partly turned away, gentle motion in her loose clothes. ${STYLE}

fal URL: https://v3b.fal.media/files/b/0aad4a3c/m_zQ-d3oyoJrW_x7o6LSK_g3wTW3on.jpg

### tancolo-evek (4:5)

> A small group of smiling women and men in their sixties dancing together in a bright studio, colourful casual sportswear with sunflower-yellow and sky-blue accents, genuine laughter, slight motion blur on hands. ${STYLE}

fal URL: https://v3b.fal.media/files/b/0aad4a3f/PANiO040QbZsMW18mYziZ_YfGtZ5CM.jpg

### hanna (4:5)

> Close detail of a dancer's bare feet and ankles mid-step on a warm wooden studio floor, soft shadow from a window, no face visible. ${STYLE}

fal URL: https://v3b.fal.media/files/b/0aad4a42/Xa145QeHRaAQM-Yba1s6J_Ws33Y0oS.jpg

## Hero loop – `fal-ai/veo3.1/fast/first-last-frame-to-video`

8 s, 1080p, 16:9, hang nélkül; `first_frame_url` = `last_frame_url` = a hero-still, így a hurok zökkenőmentes (ellenőrizve: első és utolsó képkocka egyezik).

> The dancer performs a slow, fluid, continuous contemporary dance phrase: the arm sweep flows into a gentle turn and returns exactly to the starting pose. Static locked-off camera, sunlight drifting softly, dust motes in the light. Calm, elegant, seamless loop.

fal URL: https://v3b.fal.media/files/b/0aad4a54/tm1srTSPJetwmnu_d1X3O_dbc0ca86bd0a432bbd90af96eab6d357.mp4

## Utómunka

- `hanna.jpg`: a nyers kép fekete/fehér keretét levágtuk (crop).
- Videó: 1280 px, H.264 CRF 28 (542 KB) és VP9 CRF 38 (676 KB), poster = első képkocka.
- Költség: kb. 4 × 0,15 $ + 8 × 0,15 $ ≈ 1,8 $.

Hallgat Hannát egyik kép sem ábrázolja.
