import { logger } from '@nrwl/devkit';
import chalk from 'chalk';
import { VersionComparisonResult } from '../../../lib/version-check/compare-package-version-to-latest';
/**
 * chalk.bold(
            comparison.package
          )
 */

export function logVersionComparisonResults<T extends VersionComparisonResult>(
  result: Record<string, T[]>,
  formatPackageName: (comparison: T) => string
) {
  const maxFileNameLength = Math.max(
    ...Object.keys(result).map((f) => f.length)
  );

  for (const [fileName, comparisons] of Object.entries(result)) {
    const logContext = `${fileName.padEnd(maxFileNameLength)}`;

    const hasInvalids = comparisons.filter(
      (c) => c.invalid || c.outdated
    ).length;

    if (!hasInvalids) {
      logger.info(`${logContext} ✅ All versions are up to date.`);
      continue;
    }

    for (const comparison of comparisons) {
      if (comparison.outdated) {
        console.log(
          `${logContext} ⚠️ ${formatPackageName(
            comparison
          )} has new version ${chalk.bold(comparison.latest)} (current: ${
            comparison.prev
          })`
        );
      }

      if (comparison.invalid) {
        console.log(
          `${logContext} ❗ ${formatPackageName(
            comparison
          )} has an invalid version (${comparison.prev}) specified. Latest is ${
            comparison.latest
          }.`
        );
      }
    }
  }
}
