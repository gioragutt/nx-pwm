/*
 * This script checks if new versions of node modules are available.
 * It uses naming conventions to transform constants to matching node module name.
 *
 * Usage:
 *   yarn check-versions [file|package]
 *
 * Positional arg:
 *   - [file]: relative or absolute file path to the versions file.
 *
 * Example:
 *   yarn check-versions react
 */

import { workspaceRoot } from '@nrwl/devkit';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import chalk from 'chalk';
import * as glob from 'glob';
import { relative } from 'path';
import {
  comparePackageVersionToLatest,
  VersionComparisonResult,
} from './compare-package-version-to-latest';
import { VersionsFilesCheckConfig } from './types';

export interface VariableVersionComparisonResult
  extends VersionComparisonResult {
  variable: string;
}

export async function versionsFilesCheck(
  config: VersionsFilesCheckConfig,
  projectRoot: string
) {
  const versionsFilesGlob = config.versionsFilesGlob || '**/versions.ts';

  const versionFiles = glob
    .sync(`${projectRoot}/${versionsFilesGlob}`)
    .map((x) => relative(workspaceRoot, x));

  return await checkFiles(config, versionFiles);
}

// -----------------------------------------------------------------------------

async function checkFiles(config: VersionsFilesCheckConfig, files: string[]) {
  console.log(chalk.blue(`Checking versions in the following files...\n`));
  console.log(`  - ${files.join('\n  - ')}\n`);

  const results: Record<string, VariableVersionComparisonResult[]> =
    Object.fromEntries(
      await Promise.all(files.map(async (f) => [f, await checkFile(config, f)]))
    );

  return results;
}

async function checkFile(
  config: VersionsFilesCheckConfig,
  f: string
): Promise<VersionComparisonResult[]> {
  // const migrationsPath = join(projectRoot, 'migrations.json');
  // const migrationsJson = readJsonSync(migrationsPath, { throws: false }) ?? {
  //   packageJsonUpdates: {},
  // };
  // let versionsContent = readFileSync(f).toString();
  const versions = getVersions(f);
  const npmPackages = getPackages(config, versions);
  const results = await Promise.all(
    npmPackages.map(async ({ variable, pkg, version }) => ({
      variable,
      ...(await comparePackageVersionToLatest(pkg, version)),
    }))
  );
  return results;
  // const packageUpdates: Record<string, PackageJsonUpdateForPackage> = {};

  // results.forEach((r) => {
  //   if (r.outdated) {
  //     versionsContent = versionsContent.replace(
  //       `${r.variable} = '${r.prev}'`,
  //       `${r.variable} = '${r.latest}'`
  //     );
  //     packageUpdates[r.package] = {
  //       version: r.latest,
  //       alwaysAddToPackageJson: false,
  //     };
  //   }
  // });

  // TODO: figure out how these migration things work in NX itself
  // if (Object.keys(packageUpdates).length > 0) {
  //   migrationsJson.packageJsonUpdates['x.y.z'] = {
  //     version: 'x.y.z',
  //     packages: packageUpdates,
  //   };
  //   writeFileSync(f, versionsContent);
  //   writeJsonSync(migrationsPath, migrationsJson, { spaces: 2 });
  // }
}

function getVersions(path: string) {
  try {
    return require(path);
  } catch {
    throw new Error(`Could not load ${path}. Please make sure it is valid.`);
  }
}

interface PackageInfo {
  pkg: string;
  version: string;
  variable: string;
}

function getPackages(
  { excludeVariables, scopes }: VersionsFilesCheckConfig,
  versions: Record<string, string>
) {
  return Object.entries(versions).reduce((acc, [variable, version]) => {
    if (!excludeVariables.includes(variable)) {
      const pkg = getNpmName(scopes, variable);
      acc.push({ pkg, version, variable });
    }
    return acc;
  }, [] as PackageInfo[]);
}

function getNpmName(scopes: string[], name: string): string {
  const dashedName = dasherize(name.replace(/Version$/, ''));
  const scope = scopes.find((s) => dashedName.startsWith(`${s}-`));

  if (scope) {
    const rest = dashedName.split(`${scope}-`)[1];
    return `@${scope}/${rest}`;
  } else {
    return dashedName;
  }
}
