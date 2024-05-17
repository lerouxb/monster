import type { MongoClient } from "mongodb";

export const knownCommands = [
  "help",
  "init",
  "update",
  "touch",
  "run",
  "start",
  "stop",
];
export type Command = (typeof knownCommands)[number];

export type Flags = Record<string, string | number | true>;

export interface Args {
  url?: string;
  env?: string;
  command?: Command;
  positional: string[];
  flags: Flags;
}
export interface MonsterOptions {
  config: Config;
  url: string;
  client: MongoClient;
  args: Args;
}

export interface Environment {
  url: string;
  start: string;
  stop: string;
}

export interface Config {
  environments: Record<string, Environment>;
}
