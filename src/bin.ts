#!/usr/bin/env node

import type { MonsterOptions } from './types';

const knownCommands = ['init', 'update', 'touch', 'run', 'exec'];
type Command = typeof knownCommands[number];

function isCommand(value: string) {
  return knownCommands.includes(value);
}

function isConnectionString(value: string) {
  return value.startsWith('mongodb://') || value.startsWith('mongodb+srv://');
}

interface ProcessedArgs {
  url?: string;
  env?: string;
  command?: Command,
  positional: string[]
}

function processArgs(argv: string[]): ProcessedArgs {
  let url: string|undefined;
  let env: string|undefined;
  let command: Command|undefined;
  let positional: string[];

  if (argv.length > 2) {
    const first = argv[2];
    if (isCommand(first)) {
      command = first as Command;
      positional = argv.slice(3);
    } else {
      if (isConnectionString(first)) {
        url = first;
      } else {
        // we'd have to check if this is actually a known env somewhere
        env = first;
      }
      const second = argv[3]; // could be undefined
      if (isCommand(second)) {
        // url or env followed by a command
        command = second as Command;
        positional = argv.slice(4)
      }
      else {
        positional = argv.slice(3);
      }
    }
  } else {
    positional = [];
  }

  return {url, env, command, positional};
}

interface Environment {
  url: string
}

async function lookupEnv(env: string): Promise<Environment> {
  // TODO
  return Promise.reject(`Unable to find env "${env}"`);
}

async function main() {
  console.log(process.cwd(), __dirname);

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

  const parameters = processArgs(process.argv);
  if (parameters.env) {
    parameters.url = (await lookupEnv(parameters.env)).url;
  }

  if (!parameters.url) {
    return;
  }

  const { url } = parameters

  const { MongoClient } = await import('mongodb');

  const client = new MongoClient(url);
  console.log("Connecting to server...");
  await client.connect();

  const options: MonsterOptions = {
    url,
    client
  };

  if (parameters.command === 'run') {
    const filename = parameters.positional[0];
    const { runScript } = await import('./script');
    await runScript(filename, options);
    client.close();
    return;
  }

  const { startShell } = await import('./shell');
  const repl = startShell(options);

  repl.on("exit", function () {
    client.close();
  });
}

main().catch(console.error);
