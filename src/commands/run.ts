import path from 'path';
import type { MonsterOptions } from "../types";

export async function runCommandWithClient(options: MonsterOptions) {
  const filename = path.resolve(options.args.positional[0]);

  if (filename.endsWith('.ts')) {
    const tsNode = await import('ts-node');
    tsNode.register();
  }

  const { run } = await import(filename);
  await run(options);
}