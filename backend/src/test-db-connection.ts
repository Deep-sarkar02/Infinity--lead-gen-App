import dns from "dns";
import "./config/env.js";
import { connectDb, disconnectDb } from "./config/database.js";

// Windows / some networks block default SRV lookups; Google DNS works for Atlas.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function main() {
  await connectDb();
  console.log("Atlas connection OK");
}

main()
  .catch((error) => {
    console.error("Atlas connection failed:", error.message);
    process.exit(1);
  })
  .finally(() => disconnectDb());
