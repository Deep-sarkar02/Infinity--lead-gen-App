import "dotenv/config";
import { connectDb, disconnectDb } from "./db.js";
import { backfillMilestones } from "./store.js";

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
