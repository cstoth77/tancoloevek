// Használat: npm run media:generate -- stills [név…] | video
// A fal.ai kimenetek a media/raw/ mappába kerülnek (gitignored); a végleges fájlokat az encode-media.sh készíti.
import { fal } from "@fal-ai/client";
import { mkdir, readFile, writeFile } from "node:fs/promises";

if (!process.env.FAL_KEY) throw new Error("FAL_KEY hiányzik (.env.local)");
fal.config({ credentials: process.env.FAL_KEY });

const RAW = "media/raw";
const URLS = `${RAW}/urls.json`;
await mkdir(RAW, { recursive: true });

const STYLE =
  "editorial documentary photograph, natural window light, warm cream, terracotta and honey wood tones, soft film grain, 35mm lens, no text, no logos, no watermark";

export const STILLS = {
  "hero-still": {
    ratio: "16:9",
    prompt: `Wide shot of a sunlit dance studio with tall windows and a honey-coloured wooden floor. A woman dancer in soft neutral clothing, seen from the side at mid distance, face turned away and not recognisable, mid-way through a slow, graceful arm sweep. She stands in the right third of the frame; the left half is calm empty space with soft light. ${STYLE}`,
  },
  "anya-baba": {
    ratio: "4:5",
    prompt: `A mother dancing joyfully in a bright studio while carrying her baby in a blush-pink woven wrap carrier, the baby safely snug on her chest, mother's face partly turned away, gentle motion in her loose clothes. ${STYLE}`,
  },
  "tancolo-evek": {
    ratio: "4:5",
    prompt: `Candid moment in a community dance class: a few women and men in their sixties and seventies learning a simple step together in a clean, well-kept bright dance studio with freshly painted cream walls and a wooden floor, ordinary muted everyday clothes (greys, navy, soft beige, one mustard cardigan), natural unposed expressions, some concentrating on their feet, one woman laughing quietly, nobody looking at the camera, slight motion blur, honest and unglamorous. ${STYLE}`,
  },
  hanna: {
    ratio: "4:5",
    prompt: `Close detail of a dancer's bare feet and ankles mid-step on a warm wooden studio floor, soft shadow from a window, no face visible. ${STYLE}`,
  },
};

const VIDEO_PROMPT =
  "The dancer performs a slow, fluid, continuous contemporary dance phrase: the arm sweep flows into a gentle turn and returns exactly to the starting pose. Static locked-off camera, sunlight drifting softly, dust motes in the light. Calm, elegant, seamless loop.";

async function load() {
  try {
    return JSON.parse(await readFile(URLS, "utf8"));
  } catch {
    return {};
  }
}
async function download(url, path) {
  await writeFile(path, Buffer.from(await (await fetch(url)).arrayBuffer()));
}

const [mode = "stills", ...only] = process.argv.slice(2);
const urls = await load();

if (mode === "stills") {
  for (const [name, { ratio, prompt }] of Object.entries(STILLS)) {
    if (only.length && !only.includes(name)) continue;
    const { data } = await fal.subscribe("fal-ai/nano-banana-pro", {
      input: { prompt, aspect_ratio: ratio, resolution: "2K", output_format: "jpeg", num_images: 1 },
    });
    urls[name] = data.images[0].url;
    await download(urls[name], `${RAW}/${name}.jpg`);
    console.log(`${name}: ${urls[name]}`);
  }
} else if (mode === "video") {
  if (!urls["hero-still"]) throw new Error("Előbb: media:generate -- stills hero-still");
  const { data } = await fal.subscribe("fal-ai/veo3.1/fast/first-last-frame-to-video", {
    input: {
      prompt: VIDEO_PROMPT,
      first_frame_url: urls["hero-still"],
      last_frame_url: urls["hero-still"],
      duration: "8s",
      resolution: "1080p",
      aspect_ratio: "16:9",
      generate_audio: false,
    },
    logs: true,
  });
  urls.hero = data.video.url;
  await download(urls.hero, `${RAW}/hero.mp4`);
  console.log(`hero video: ${urls.hero}`);
} else {
  throw new Error(`Ismeretlen mód: ${mode}`);
}
await writeFile(URLS, JSON.stringify(urls, null, 2));
