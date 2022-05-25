import { fileExists, readJsonFile } from 'nx/src/utils/fileutils';

export type IgnoreConfig = { '*': string[] } & Record<string, string[]>;

export type VersionType = 'synced' | 'independent';

export interface NxPwmConfig {
  versionType: VersionType;
  depcheck: {
    ignore: {
      discrepancies: IgnoreConfig;
      missing: IgnoreConfig;
    };
  };
}

export function readNxPwmConfig(): NxPwmConfig {
  const configPath = '.nx-pwm.json';

  if (!fileExists(configPath)) {
    throw new Error(
      `Could not find ${configPath}. Please run 'nx g nx-pwm:init' to create one.`
    );
  }

  return readJsonFile(configPath);
}
