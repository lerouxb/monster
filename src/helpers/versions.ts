"../package.json";
import path from "path";
import { checkFileExists } from "./fs";

async function findPackageJSON(dirname: string): Promise<string> {
  const filename = path.join(dirname, "package.json");
  if (await checkFileExists(filename)) {
    return filename;
  }
  return findPackageJSON(path.dirname(dirname));
}

export async function getVersions() {
  const packageJSONPath = await findPackageJSON(__dirname);
  return {
    node: process.version,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    "monster-shell": require(packageJSONPath).version, // TODO
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mongodb: require("mongodb/package.json").version,
  };
}
