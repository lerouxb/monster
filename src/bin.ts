#!/usr/bin/env node

import { MongoClient } from "mongodb";
import { startShell } from "./index";

async function main() {
  // TODO: help
  // TODO: dynamic import
  // TODO: support connection string env var, env name env var, env names, monster.config.ts
  // TODO: `monster init` for setting up package.json/typescript/vscode, .gitignore
  // TODO: `monster update` for updating the above to match the versions in monster
  // TODO: `monster touch`
  // TODO: `monster start|stop|ls`?
  // TODO: `monster [uri|env] run filename.ts
  // TODO: `monster [uri|env] exec "some typescript code"
  // TODO: kill sessions on ctrl-c
  // TODO: add helpers?

  const url = process.argv[2];
  const client = new MongoClient(url);
  console.log("Connecting to server...");
  await client.connect();

  startShell({ url, client });
}

main().catch(console.error);
