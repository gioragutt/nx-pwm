import { joinPathFragments, logger } from '@nrwl/devkit';
import chalk from 'chalk';
import { packageJsonCheck } from '../../../lib/version-check';
import { logVersionComparisonResults } from './logging';

export async function performPackageJsonCheck(projectRoot: string) {
  const packageJsonPath = joinPathFragments(projectRoot, 'package.json');
  const result = await packageJsonCheck(packageJsonPath);

  const invalidComparisons = result.filter((c) => c.invalid || c.outdated);

  if (!invalidComparisons.length) {
    logger.info(`✅ All versions are up to date.`);
    return true;
  }

  logVersionComparisonResults(
    { [packageJsonPath]: result },
    (c) => `${chalk.bold(c.package)}`
  );

  return false;
}
