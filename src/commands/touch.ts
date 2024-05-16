import { promises as fs } from 'fs';
import path from 'path';
import type { Args, Config } from "../types";
import { checkFileExists } from '../helpers/fs';

const template = `
import { MonsterOptions } from 'monster-shell';

export async function run({ client }: MonsterOptions) {
  //const coll = client.db('test').collection('documents');
  //await coll.find().toArray();
}
`.trimStart();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function runCommand(args: Args, config: Config) {
  const filename =  path.resolve(process.cwd(), args.positional[0]);

  if (await checkFileExists(filename)) {
    throw new Error(`${filename} already exists`);
  }

  await fs.writeFile(filename, template, 'utf8');
}