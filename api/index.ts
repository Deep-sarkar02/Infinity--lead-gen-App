import serverless from "serverless-http";
import { buildApp } from "../server/src/app.js";

const app = buildApp();

export default serverless(app);
