import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");
const svg = readFileSync(join(publicDir, "favicon.svg"));

const icons = [
  { name: "favicon-32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
];

for (const icon of icons) {
  const padding = icon.maskable ? Math.round(icon.size * 0.1) : 0;
  const inner = icon.size - padding * 2;

  let pipeline = sharp(svg).resize(inner, inner, { fit: "contain", background: "#0162C9" });

  if (padding > 0) {
    pipeline = sharp(await pipeline.png().toBuffer()).extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: "#0162C9",
    });
  }

  await pipeline.png().toFile(join(publicDir, icon.name));
  console.log(`Wrote ${icon.name}`);
}
