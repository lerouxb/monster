import type { Config, Environment } from '../types';

export function lookupEnvInConfig(envName: string, config: Config): Environment {
  const environment = config.environments[envName];

  if (!environment) {
    throw new Error(`Unable to find env "${envName}"`);
  }

  return environment;
}
