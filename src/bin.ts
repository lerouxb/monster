#!/usr/bin/env node

import { loadConfig } from './helpers/config';
import { lookupEnvInConfig } from './helpers/environments';
import type { Command, Flags, MonsterOptions, Args, Config } from './types';
import { knownCommands } from './types';


function isCommand(value: string) {
  return knownCommands.includes(value);
}

function isConnectionString(value: string) {
  return value.startsWith('mongodb://') || value.startsWith('mongodb+srv://');
}

function processArgs(argv: string[]): Args {
  const args = argv.slice(2);

  let url: string|undefined;
  let env: string|undefined;
  let command: Command|undefined;
  const positional: string[] = []
  const flags: Flags = {};

  for (const arg of args) {
    if (arg.startsWith('--')) {
      // --foo, --foo=bar or --foo=bar=baz
      const match = arg.match(/^--(?<key>[^=]+)(=(?<value>.*))?/);
      flags[match?.groups?.key ?? ''] = match?.groups?.value ?? true;
    }
    else if (arg.startsWith('-')) {
      for (const letter of arg.slice(1)) {
        if (typeof(flags[letter]) === 'number') {
          // -vvv results in { v: 3 }
          flags[letter] = (flags[letter] as number) + 1;
        }
        else {
          flags[letter] = 1;
        }
      }
    } else {
      positional.push(arg);
    }
  }

  if (positional.length) {
    const first = positional[0];
    if (isCommand(first)) {
      command = first as Command;
      positional.splice(0, 1);
    } else {
      if (isConnectionString(first)) {
        url = first;
      } else {
        // we'd have to check if this is actually a known env somewhere
        env = first;
      }
      const second = positional[1]; // could be undefined
      if (isCommand(second)) {
        // url or env followed by a command
        command = second as Command;
        positional.splice(0, 2);
      }
      else {
        positional.splice(0, 1);
      }
    }
  }

  return { url, env, command, flags, positional };
}

function lookupUrlFromArgs(args: Args, config: Config): string|undefined {
  if (args.url) {
    return args.url;
  }

  if (args.env) {
    return lookupEnvInConfig(args.env, config).url;
  }

  return undefined;
}

async function main() {
  const config = await loadConfig();
  // TODO: `monster start|stop`?

  const args = processArgs(process.argv);
  const url = lookupUrlFromArgs(args, config);

  // TODO: help
  // TODO: `monster init` for setting up package.json/typescript/vscode, .gitignore
  // TODO: `monster update` for updating the above to match the versions in monster
  // TODO: `monster touch`
  // TODO: `monster start|stop|ls`?

  if (args.command === 'help') {
    const { runCommand } = await import('./commands/help');
    return await runCommand(args, config);
  }

  if (args.command === 'init') {
    const { runCommand } = await import('./commands/init');
    return await runCommand(args, config);
  }

  if (args.command === 'update') {
    const { runCommand } = await import('./commands/update');
    return await runCommand(args, config);
  }

  if (args.command === 'touch') {
    const { runCommand } = await import('./commands/touch');
    return await runCommand(args, config);
  }

  if (args.command === 'start') {
    const { runCommand } = await import('./commands/start');
    return await runCommand(args, config);
  }

  if (args.command === 'stop') {
    const { runCommand } = await import('./commands/stop');
    return await runCommand(args, config);
  }

  // everything from here on out should be commands that require a connection

  if (!url) {
    throw new Error('No connection specified');
  }

  if (args.command && !['run'].includes(args.command)) {
    throw new Error(`Command ${args.command} specified which does not work with a connection.`);
  }

  const { MongoClient } = await import('mongodb');

  const client = new MongoClient(url);
  if (args.env) {
    console.log(`Connecting to ${url}...`);
  }
  else {
    console.log('Connecting to server...');
  }
  await client.connect();

  // TODO: add helpers and stick it on MonsterOptions?

  const options: MonsterOptions = {
    config,
    args,
    url,
    client,
  };

  if (args.command === 'run') {
    const { runCommandWithClient } = await import('./commands/run');
    await runCommandWithClient(options);
    client.close();
    return;
  }

  const { runCommandWithClient } = await import('./commands/shell');
  const repl = runCommandWithClient(options);

  repl.on("exit", function () {
    client.close();
  });
}

main().catch(console.error);
