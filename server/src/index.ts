import "dotenv/config";
import { buildApp } from "./app.js";
import { connectDb } from "./db.js";
import {
  backfillLeadVolunteerFields,
  backfillMilestones,
} from "./store.js";

const PORT = process.env.PORT ?? 3001;
const app = buildApp();

connectDb()
  .then(async () => {
    await backfillLeadVolunteerFields();
    await backfillMilestones();
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
