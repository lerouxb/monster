import type { MongoClient } from "mongodb";

export const knownCommands = ['help', 'init', 'update', 'touch', 'run'];
export type Command = typeof knownCommands[number];

export type Flags = Record<string, string|number|true>;

export interface Args {
  url?: string
  env?: string
  command?: Command
  positional: string[]
  flags: Flags
}
export interface MonsterOptions {
  url: string
  client: MongoClient
  args: Args
}

