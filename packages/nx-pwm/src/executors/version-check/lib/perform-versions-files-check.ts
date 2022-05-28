import { logger, output } from '@nrwl/devkit';
import chalk from 'chalk';
import {
  createOrUpdateMigrations,
  NormalizedVersionCheckOptions,
  updateVersionsFile,
  versionsFilesCheck,
} from '../../../lib/version-check';
import { VersionCheckExecutorSchema } from '../schema';
import { logVersionComparisonResults } from './logging';

export async function performVersionsFilesCheck(
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

  if (!invalidComparisons.length && !outdatedComparisons.length) {
    logger.info(`✅ All versions are up to date.`);
    return true;
  }

  logVersionComparisonResults(
    result,
    (c) => `${chalk.bold(c.package)} (${c.variable})`
  );

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

  if (options.updateVersionsFiles) {
    if (outdatedComparisons.length) {
      const updatedFiles: string[] = [];

      for (const [versionFile, comparisons] of Object.entries(result)) {
        const outdated = comparisons.filter((c) => c.outdated);
        if (!outdated.length) {
          continue;
        }

        updatedFiles.push(versionFile);
        updateVersionsFile(versionFile, outdated);
      }

      output.success({
        title: 'Updating versions files',
        bodyLines: updatedFiles,
      });
    } else {
      logger.info('No outdated versions found, so not updating versions files');
    }
  }

  return (
    invalidComparisons.length === 0 &&
    (outdatedComparisons.length === 0 || options.updateVersionsFiles)
  );
}
