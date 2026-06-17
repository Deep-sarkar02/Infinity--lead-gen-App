import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");
const logoPath = join(publicDir, "logo-ilbtl.png");
const brandBlue = "#0162C9";

const icons = [
  { name: "favicon-32.png", size: 32, paddingRatio: 0.08 },
  { name: "apple-touch-icon.png", size: 180, paddingRatio: 0.1 },
  { name: "icon-192.png", size: 192, paddingRatio: 0.1 },
  { name: "icon-512.png", size: 512, paddingRatio: 0.1 },
  { name: "icon-maskable-512.png", size: 512, paddingRatio: 0.18 },
];

async function logoOnTransparentBg() {
  const { data, info } = await sharp(logoPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 40 && g < 40 && b < 40) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function renderIcon(size, paddingRatio) {
  const padding = Math.round(size * paddingRatio);
  const inner = size - padding * 2;

  const logo = await (await logoOnTransparentBg())
    .resize(inner, inner, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: brandBlue,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
}

for (const icon of icons) {
  const buffer = await renderIcon(icon.size, icon.paddingRatio);
  await sharp(buffer).toFile(join(publicDir, icon.name));
  console.log(`Wrote ${icon.name}`);
}

const faviconBuffer = await renderIcon(32, 0.08);
const base64 = faviconBuffer.toString("base64");
writeFileSync(
  join(publicDir, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><image href="data:image/png;base64,${base64}" width="32" height="32"/></svg>`,
);
console.log("Wrote favicon.svg");
