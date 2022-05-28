import { logger } from '@nrwl/devkit';
import { exec } from 'child_process';
import { gt, coerce } from 'semver';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface VersionComparisonResult {
  package: string;
  outdated: boolean;
  invalid: boolean;
  latest: string;
  prev?: string;
}

export async function comparePackageVersionToLatest(
  pkg: string,
  version: string
): Promise<VersionComparisonResult> {
  try {
    version = coerce(version).format();

    const output = await execAsync(`npm view ${pkg} version --json --silent`);
    const latest = JSON.parse(output.stdout);

    if (gt(latest, version)) {
      return {
        package: pkg,
        outdated: true,
        invalid: false,
        latest,
        prev: version,
      };
    }
    if (gt(version, latest)) {
      return {
        package: pkg,
        outdated: false,
        invalid: true,
        latest,
        prev: version,
      };
    }
  } catch (e) {
    // ignored
    logger.error(
      `Error parsing versions (${JSON.stringify({ pkg, version })})`
    );
    logger.error(e);
  }

  return {
    package: pkg,
    outdated: false,
    invalid: false,
    latest: version,
  };
}
