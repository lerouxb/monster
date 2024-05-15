import type { MongoClient } from "mongodb";
import * as tsNode from "ts-node";

interface MonsterOptions {
  url: string;
  client: MongoClient;
}

export function startShell({ url, client }: MonsterOptions) {
  const shellGlobals = {
    url,
    client,
  };

  (global as any)._shellGlobals = shellGlobals;

  const repl = tsNode.createRepl();
  const service = tsNode.create({ ...repl.evalAwarePartialHost });
  repl.setService(service);

  console.log("Starting MONSTER..."); // sanity check
  const r = repl.start();

  const startLines = [];
  startLines.push("const _globals = (global as any)._shellGlobals;");
  for (const key of Object.keys(shellGlobals).slice()) {
    startLines.push(`const ${key} = _globals['${key}'];`);
  }

  for (const line of startLines) {
    repl.evalCode(line);
  }

  r.on("exit", function () {
    client.close();
  });
}
