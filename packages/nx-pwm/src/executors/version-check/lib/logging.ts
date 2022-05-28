import { logger, output } from '@nrwl/devkit';
import chalk from 'chalk';
import { VersionComparisonResult } from '../../../lib/version-check';

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

    const findings = comparisons.flatMap((comparison) => {
      if (comparison.outdated) {
        return [
          `⚠️ ${formatPackageName(comparison)} has new version ${chalk.bold(
            comparison.latest
          )} (current: ${comparison.prev})`,
        ];
      }

      if (comparison.invalid) {
        return [
          `❗ ${formatPackageName(comparison)} has an invalid version (${
            comparison.prev
          }) specified. Latest is ${comparison.latest}.`,
        ];
      }

      return [];
    });

    output.warn({
      title: fileName,
      bodyLines: findings,
    });
  }
}
