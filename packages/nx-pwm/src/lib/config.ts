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

export const NX_PWM_CONFIG_PATH = '.nx-pwm.json';

export function readNxPwmConfig(): NxPwmConfig {
  if (!fileExists(NX_PWM_CONFIG_PATH)) {
    throw new Error(
      `Could not find ${NX_PWM_CONFIG_PATH}. Please run 'nx g nx-pwm:init' to create one.`
    );
  }

  return readJsonFile(NX_PWM_CONFIG_PATH);
}
