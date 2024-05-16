import * as tsNode from "ts-node";
import type { MonsterOptions } from './types';

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
  // TODO: print a summary of what we're connected to, what versions we're
  // running with and so on.

  const startLines = [];
  startLines.push("const _globals = (global as any)._shellGlobals;");
  for (const key of Object.keys(shellGlobals).slice()) {
    startLines.push(`const ${key} = _globals['${key}'];`);
  }

  const r = repl.start();

  for (const line of startLines) {
    repl.evalCode(line);
  }

  return r;
}