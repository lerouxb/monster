import { MongoClient } from 'mongodb'
import * as tsNode from 'ts-node';


const url = process.argv[2];
const client = new MongoClient(url);

async function main() {
  // Use connect method to connect to the server
  console.log('Connecting to server...');
  await client.connect();

  await startShell({ client });
}

async function startShell({ client }: { client: MongoClient }) {
  const shellGlobals = {
    url,
    client
  };

  const shellTypes = {
    url: 'string',
    client: 'MongoClient'
  };

  (global as any)._shellGlobals = shellGlobals;

  const repl = tsNode.createRepl();
  const service = tsNode.create({ ...repl.evalAwarePartialHost });
  repl.setService(service);


  console.log('Starting MONSTER...'); // sanity check
  const r = repl.start();

  const startLines = [];
  startLines.push('import type { MongoClient } from \'mongodb\';');
  startLines.push('const _globals = (global as any)._shellGlobals;');
  for (const key of Object.keys(shellGlobals).slice()) {
    const type: string = (shellTypes as any)[key] ?? 'any';
    startLines.push(`const ${key}: ${type} = _globals['${key}'];`);
  }

  for (const line of startLines) {
    repl.evalCode(line);
  }

  r.on('exit', function () {
    client.close();
  });
}

main().catch(console.error);
