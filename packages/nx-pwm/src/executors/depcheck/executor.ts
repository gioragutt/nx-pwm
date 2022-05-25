import {
  ExecutorContext,
  joinPathFragments,
  logger,
  readJsonFile,
} from '@nrwl/devkit';
import chalk from 'chalk';
import { fileExists } from 'nx/src/utils/fileutils';
import { PackageJson } from 'nx/src/utils/package-json';
import { readNxPwmConfig } from '../../lib/config';
import {
  getDiscrepancies,
  getMissingDependencies,
  MissingDependency,
  VersionDiscrepancy,
} from '../../lib/depcheck';
import { DepcheckExecutorSchema } from './schema';

export default async function runExecutor(
  options: DepcheckExecutorSchema,
  { workspace, projectName }: ExecutorContext
) {
  const config = readNxPwmConfig();
  const { root: projectRoot } = workspace.projects[projectName];

  const packageJsonPath = joinPathFragments(projectRoot, 'package.json');

  console.log(projectName, projectRoot);

  if (!fileExists(packageJsonPath)) {
    logger.error(`No package.json found in ${projectName}`);
    return { success: false };
  }

  const projectPackageJson = readJsonFile<PackageJson>(packageJsonPath);
  const rootPackageJson = readJsonFile<PackageJson>('package.json');

  const discrepancies = options.discrepancies
    ? getDiscrepancies(config, projectName, projectPackageJson, rootPackageJson)
    : [];

  const missing = options.missing
    ? await getMissingDependencies(
        config,
        projectName,
        projectRoot,
        projectPackageJson,
        rootPackageJson
      )
    : [];

  if (!missing.length && !discrepancies.length) {
    logger.info(`${projectName} dependencies are up to date`);
    return { success: true };
  }

  logFindings(missing, discrepancies);

  return { success: false, missing, discrepancies };
}

function logFindings(
  missing: MissingDependency[],
  discrepancies: VersionDiscrepancy[]
) {
  if (missing.length > 0) {
    const logLines = missing
      .sort((a, b) => a.packageName.localeCompare(b.packageName))
      .map(
        ({ packageName, rootVersion }) =>
          `   ${rootVersion ? `${packageName}@${rootVersion}` : packageName}`
      )
      .join(`\n`);

    logger.warn(`⛔  ${chalk.bold.inverse(` Missing `)}\n${logLines}\n`);
  }

  if (discrepancies.length > 0) {
    const logLines = discrepancies
      .map(
        ({ packageName, projectVersion, rootVersion }) =>
          `   ${packageName}@${rootVersion} ${chalk.dim(projectVersion)}`
      )
      .join(`\n`);

    logger.warn(`⚠️  ${chalk.bold.inverse(` Discrepancies `)}\n${logLines}`);
  }
}
