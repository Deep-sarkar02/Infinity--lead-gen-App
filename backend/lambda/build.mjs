import * as esbuild from "esbuild";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "dist");

await mkdir(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(__dirname, "webhook/handler.ts")],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  outfile: path.join(outDir, "handler.js"),
  minify: true,
  sourcemap: true,
  logLevel: "info",
});

console.log("Lambda bundle written to backend/lambda/dist/handler.js");
