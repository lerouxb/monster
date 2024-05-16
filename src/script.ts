import path from 'path';
import type { MonsterOptions } from "./types";

export async function runScript(filename: string, options: MonsterOptions) {
  filename = path.resolve(filename);

  if (filename.endsWith('.ts')) {
    const tsNode = await import('ts-node');
    tsNode.register();
  }

  const { run } = await import(filename);
  await run(options);
}