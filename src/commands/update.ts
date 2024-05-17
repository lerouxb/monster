import { promises as fs } from "fs";
import path from "path";
import type { Args, Config } from "../types";
import { exec } from "../helpers/child_process";
import { getVersions } from "../helpers/versions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function runCommand(args: Args, config: Config) {
  const dirname = process.cwd();
  const packageJSONPath = path.join(dirname, "package.json");
  const packageJSON = JSON.parse(await fs.readFile(packageJSONPath, "utf8"));

  const monsterShellVersion = (await getVersions())["monster-shell"];
  const expectedVersion = `^${monsterShellVersion}`;

  if (packageJSON.dependencies["monster-shell"] === expectedVersion) {
    console.log(`Already using monster-shell@${expectedVersion}`);
    return;
  }

  const { stdout } = await exec(
    `npm install --save monster-shell@${expectedVersion}`,
  );
  console.log(stdout);
}
