import { MongoClient } from 'mongodb'
import * as tsNode from 'ts-node';


const url = process.argv[2];
const client = new MongoClient(url);

async function main() {
  // Use connect method to connect to the server
  console.log('Connecting to server...');
  await client.connect();

  startShell({ client });
}

function startShell({ client }: { client: MongoClient }) {
  const shellGlobals = {
    url,
    client
  };

  (global as any)._shellGlobals = shellGlobals;

  const repl = tsNode.createRepl();
  const service = tsNode.create({ ...repl.evalAwarePartialHost });
  repl.setService(service);


  console.log('Starting MONSTER...'); // sanity check
  const r = repl.start();

  const startLines = [];
  startLines.push('const _globals = (global as any)._shellGlobals;');
  for (const key of Object.keys(shellGlobals).slice()) {
    startLines.push(`const ${key} = _globals['${key}'];`);
  }

  for (const line of startLines) {
    repl.evalCode(line);
  }

  r.on('exit', function () {
    client.close();
  });
}

main().catch(console.error);
