import "./config/env.js";
import { connectDb, disconnectDb } from "./config/database.js";
import { backfillMilestones } from "./services/lead.service.js";

async function main() {
  await connectDb();
  await backfillMilestones();
  console.log("Milestone sync complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => disconnectDb());
