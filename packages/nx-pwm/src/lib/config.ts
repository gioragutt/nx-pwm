import { fileExists, readJsonFile } from 'nx/src/utils/fileutils';
import { getPackageManagerCommand } from '@nrwl/devkit';

export type IgnoreConfig = { '*': string[] } & Record<string, string[]>;

export type VersionType = 'synced' | 'independent';

export interface NxPwmConfig {
  versionType: VersionType;
  depcheck: {
    ignore: {
      discrepancies: IgnoreConfig;
      missing: IgnoreConfig;
    };
    acceptWildcardVersion?: boolean;
  };
  versionCheck?: {
    versionsFiles?: {
      versionsFilesGlob: string;
      scopes?: string[];
      excludeVariables?: string[];
    };
  };
  localRegistry: {
    verdaccioConfig: string;
  };
}

export const NX_PWM_CONFIG_PATH = '.nx-pwm.json';

export function nxPwmConfigExists(): boolean {
  return fileExists(NX_PWM_CONFIG_PATH);
}

export function readNxPwmConfig(): NxPwmConfig {
  if (!nxPwmConfigExists()) {
    const { exec } = getPackageManagerCommand();
    throw new Error(
      `Could not find ${NX_PWM_CONFIG_PATH}. Please run '${exec} nx generate nx-pwm:install' to create one.`
    );
  }

  return readJsonFile(NX_PWM_CONFIG_PATH);
}
