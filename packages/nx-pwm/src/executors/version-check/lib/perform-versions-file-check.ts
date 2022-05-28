import { logger, output } from '@nrwl/devkit';
import chalk from 'chalk';
import {
  createOrUpdateMigrations,
  NormalizedVersionCheckOptions,
  versionsFilesCheck,
} from '../../../lib/version-check';
import { logVersionComparisonResults } from './logging';
import { VersionCheckExecutorSchema } from '../schema';

export async function performVersionsFileCheck(
  normalizedConfig: NormalizedVersionCheckOptions,
  projectRoot: string,
  options: VersionCheckExecutorSchema
) {
  const result = await versionsFilesCheck(
    normalizedConfig.versionsFiles,
    projectRoot
  );

  const allComparisons = Object.values(result).flat();
  const invalidComparisons = allComparisons.filter((c) => c.invalid);
  const outdatedComparisons = allComparisons.filter((c) => c.outdated);

  if (options.updateMigrations) {
    if (outdatedComparisons.length) {
      output.log({
        title: 'Updating migrations.json',
        bodyLines: [
          'Migrations are created for outdated versions declared in versions files.',
          `Migrations are placed in a placeholder update section ("version": "x.y.z"), update it to reflect the version you're going to release.`,
        ],
      });
      createOrUpdateMigrations(projectRoot, outdatedComparisons);
    } else {
      logger.info(
        'No outdated versions found, so not updating migrations.json'
      );
    }
  }

  logVersionComparisonResults(
    result,
    (c) => `${chalk.bold(c.package)} (${c.variable})`
  );

  return invalidComparisons.length > 0 || outdatedComparisons.length > 0;
}
