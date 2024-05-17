import type { Args, Config } from "../types";
import { getVersions } from "../helpers/versions";

type List = [string, string][];

function printList(list: List) {
  let maxLen = 0;
  for (const [col1] of list) {
    if (col1.length > maxLen) {
      maxLen = col1.length;
    }
  }
  for (const [col1, col2] of list) {
    console.log(`${col1.padEnd(maxLen)} ${col2}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function runCommand(args: Args, config: Config) {
  const versions = await getVersions();
  const versionList: List = [
    ["node", versions.node],
    ["monster-shell", versions["monster-shell"]],
    ["mongodb node driver", versions.mongodb],
  ];

  console.log();
  console.log("Versions: ");
  console.log();
  printList(versionList);

  const usageList: List = [
    ["monster help", "Print this help text."],
    [
      "monster init [--link]",
      "Turn the current directory into an npm package, add monster-shell as a dep and install. Add a monster.conf.json.",
    ],
    [
      "monster update",
      "Update the monster-shell dep in package.json to match this version of monster.",
    ],
    [
      "monster touch filename.ts",
      "Create a .ts file with required monster type boilerplate.",
    ],
    [
      "monster [URL|environment]",
      "Connect to the URL or the URL for the specified environment in monster.conf.js and start a shell.",
    ],
    [
      "monster [URL|environment] run filename.[js|ts]",
      "Connect to the URL or the URL for the specified environment in monster.conf.js and run the specified script.",
    ],
  ];

  console.log();
  console.log("Usage: ");
  console.log();
  printList(usageList);

  console.log();

  // TODO: document the shell globals and the script boilerplate?
}
