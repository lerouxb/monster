import util from 'util';
import { exec as _exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import type { Args } from '../types';
import { getVersions } from '../helpers/versions';
import { checkFileExists } from '../helpers/fs';

import { promises as readline } from 'readline';
import { stdin as input, stdout as output } from 'process';

const exec = util.promisify(_exec);

export async function runCommand(args: Args) {
  const dirname = process.cwd();

  const packageJSONPath = path.join(dirname, 'package.json');
  const monsterConfigJSONPath = path.join(dirname, 'monster.config.json');

  if (await checkFileExists(packageJSONPath)) {
    throw new Error('package.json already exists');
  }

  if (await checkFileExists(monsterConfigJSONPath)) {
    throw new Error('monster.config.json already exists');
  }

  const basename = path.basename(dirname);

  const monsterShellVersion = (await getVersions())['monster-shell'];

  const packageJSON = {
    name: basename,
    dependencies: {
      'monster-shell': `^${monsterShellVersion}`
    }
  };

  const packageJSONString = JSON.stringify(packageJSON, null, 2);

  const monsterConfigJSON = {
    envs: {
      '//': 'CAUTION: Do not put connections that use secrets in here. This is mainly useful for development.',
      dev: {
        url: 'mongodb://localhost:27017',
        start: 'npx mongodb-runner start -t replset --secondaries=0 --id=dev -- --port 27017',
        stop: 'npx mongodb-runner stop --id=dev'
      }
    }
  };

  const monsterConfigJSONString = JSON.stringify(monsterConfigJSON, null, 2);

  console.log(`About to write to ${packageJSONPath}:`);
  console.log('');
  console.log(packageJSONString);

  console.log('');

  console.log(`and to ${monsterConfigJSONPath}:`);
  console.log('');
  console.log(monsterConfigJSONString);

  console.log('');

  const rl = readline.createInterface({ input, output });
  const answer = await rl.question('Is this OK? (yes)? ');
  rl.close();

  if (!['', 'y', 'yes'].includes(answer.toLowerCase())) {
    return;
  }

  await fs.writeFile(packageJSONPath, packageJSONString, 'utf8');
  await fs.writeFile(monsterConfigJSONPath, monsterConfigJSONString, 'utf8');

  if (args.flags.link) {
    // requries that you `npm link` in the checked out code first
    exec('npm link monster-shell');
  }
  else {
    // TODO: actually publish monster-shell
    exec('npm install');
  }

  console.log();

  console.log('Tips:');
  console.log();
  console.log(`* Use \`monster dev start\` to start a dev server, then \`monster dev\` to open a shell on ${monsterConfigJSON.envs.dev.url}.`);
  console.log('* Use `monster touch my-script.ts` to create your first script and `monster dev run my-script.ts` to execute it.');
  console.log('* Use `monster your-connection-string-here` to connect to an arbitrary mongodb deployment or `monster `your-connection-string-here run my-script.ts` to execute a script against that deployment.');

  console.log();
}