import { exec } from "../helpers/child_process";
import { lookupEnvInConfig } from "../helpers/environments";
import type { Args, Config } from "../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function runCommand(args: Args, config: Config) {
  if (!args.env) {
    throw new Error("No environment specified.");
  }

  const environment = lookupEnvInConfig(args.env, config);

  const { stdout } = await exec(environment.start);
  console.log(stdout);
}
