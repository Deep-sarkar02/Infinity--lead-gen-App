import { buildApp } from "../server/src/app.js";

// Vercel runs Express apps as a native serverless function (no serverless-http wrapper).
export default buildApp();
