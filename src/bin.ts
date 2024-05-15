import { MongoClient } from "mongodb";
import { startShell } from "./index";

const url = process.argv[2];
const client = new MongoClient(url);

async function main() {
  // Use connect method to connect to the server
  console.log("Connecting to server...");
  await client.connect();

  startShell({ url, client });
}

main().catch(console.error);
