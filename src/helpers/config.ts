import { promises as fs } from 'fs';
import path from 'path';
import type { Config } from '../types'

export async function loadConfig(): Promise<Config> {
  const dirname = process.cwd();
  const monsterConfigJSONPath = path.join(dirname, 'monster.config.json');

  let text;
  try {
    text = await fs.readFile(monsterConfigJSONPath, 'utf8');
  } catch (err) {
    return { environments: {} };
  }

  const data = JSON.parse(text);
  // TODO: obviously we need to validate this
  return data as Config;
}