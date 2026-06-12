import "dotenv/config";
import { randomUUID } from "crypto";
import { connectDb, disconnectDb } from "./db.js";
import { LeadModel, UserModel } from "./models.js";
import { syncUserMilestones } from "./store.js";

const COUNT = Number.parseInt(process.argv[2] ?? "100", 10);
const VERIFIED = process.argv.includes("--verified");
const DEMO_UID = "demo-volunteer-001";

async function main() {
  if (!Number.isFinite(COUNT) || COUNT < 1 || COUNT > 1000) {
    console.error("Usage: tsx src/seed-test-leads.ts [count] [--verified]");
    process.exit(1);
  }

  await connectDb();

  let user = await UserModel.findOne({ firebase_uid: DEMO_UID });
  if (!user) {
    user = await UserModel.findOne().sort({ created_at: -1 });
  }
  if (!user) {
    console.error("No users in database. Log in with Demo mode first, then re-run.");
    process.exit(1);
  }

  const existingPhones = new Set(
    (await LeadModel.find({}, { student_phone: 1 }).lean()).map((l) => l.student_phone),
  );

  const now = new Date();
  const leads = [];
  let added = 0;

  for (let i = 1; added < COUNT; i++) {
    const phone = `98${String(10000000 + i).padStart(8, "0")}`;
    if (existingPhones.has(phone)) continue;

    existingPhones.add(phone);
    leads.push({
      id: randomUUID(),
      volunteer_id: user.id,
      volunteer_name: user.full_name,
      volunteer_email: user.email,
      student_name: `Test Student ${added + 1}`,
      student_phone: phone,
      status: VERIFIED ? "verified" : "unverified",
      verified_at: VERIFIED ? new Date(now.getTime() - added * 60_000) : null,
      created_at: new Date(now.getTime() - added * 60_000),
    });
    added++;
  }

  if (leads.length > 0) {
    await LeadModel.insertMany(leads, { ordered: false });
  } else {
    console.log("No new leads to add (phones already exist).");
  }

  let milestonesCreated = 0;
  if (VERIFIED) {
    milestonesCreated = await syncUserMilestones(user.id);
  }

  const summary = await LeadModel.aggregate([
    { $match: { volunteer_id: user.id } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        verified: { $sum: { $cond: [{ $eq: ["$status", "verified"] }, 1, 0] } },
      },
    },
  ]);

  const stats = summary[0] ?? { total: 0, verified: 0 };
  if (leads.length > 0) {
    console.log(
      `Added ${leads.length} ${VERIFIED ? "verified " : ""}leads for ${user.full_name} (${user.email}).`,
    );
  }
  console.log(`Totals: ${stats.total} leads, ${stats.verified} verified.`);
  if (milestonesCreated > 0) {
    console.log(`Created ${milestonesCreated} milestone reward(s).`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => disconnectDb());
