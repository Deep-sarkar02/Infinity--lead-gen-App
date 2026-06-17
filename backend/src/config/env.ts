import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const envPath = path.join(repoRoot, ".env");

if (!fs.existsSync(envPath)) {
  console.warn(`[env] No .env at ${envPath} — using process environment only`);
} else {
  dotenv.config({ path: envPath });
}
