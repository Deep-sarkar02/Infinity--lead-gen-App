import "./config/env.js";
import { connectDb, disconnectDb } from "./config/database.js";
import { LeadModel, MilestoneEventModel, UserModel, WalletItemModel } from "./models/index.js";

async function main() {
  await connectDb();

  const leadResult = await LeadModel.deleteMany({});
  const milestoneResult = await MilestoneEventModel.deleteMany({});
  const walletResult = await WalletItemModel.deleteMany({});
  await UserModel.updateMany({}, { $set: { verified_lead_count: 0, updated_at: new Date() } });

  console.log(`Deleted ${leadResult.deletedCount} leads.`);
  console.log(`Deleted ${milestoneResult.deletedCount} milestone events.`);
  console.log(`Deleted ${walletResult.deletedCount} wallet items.`);
  console.log("Reset verified_lead_count for all users.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => disconnectDb());
