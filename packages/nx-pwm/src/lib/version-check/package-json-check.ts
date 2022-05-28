import { readJsonFile, workspaceRoot } from '@nrwl/devkit';
import chalk from 'chalk';
import * as glob from 'glob';
import { PackageJson } from 'nx/src/utils/package-json';
import { relative } from 'path';
import { nameToPackageJson } from '../workspace-utils';
import { comparePackageVersionToLatest } from './compare-package-version-to-latest';

try {
  const files = glob
    .sync('libs/**/package.json')
    .map((x) => relative(workspaceRoot, x));
  checkFiles(files);
} catch (e) {
  console.log(chalk.red(e.message));
  process.exitCode = 1;
}

// -----------------------------------------------------------------------------

async function checkFiles(packageJsonFiles: string[]) {
  const rootPackageJson = readJsonFile<PackageJson>('package.json');

  console.log(chalk.blue(`Checking versions in the following files...\n`));
  console.log(`  - ${packageJsonFiles.join('\n  - ')}\n`);

  const maxFileNameLength = Math.max(...packageJsonFiles.map((f) => f.length));

  let hasError = false;

  for (const f of packageJsonFiles) {
    const packageJsonContent = readJsonFile<PackageJson>(f);

    const results = await Promise.all(
      Object.entries({
        ...packageJsonContent.dependencies,
        ...packageJsonContent.devDependencies,
      })
        .filter(([name]) => !nameToPackageJson[name])
        .map<[name: string, version: string]>(([name, version]) => {
          if (version !== '*') {
            return [name, version];
          }
          const versionFromRoot: string =
            rootPackageJson.dependencies?.[name] ??
            rootPackageJson.devDependencies?.[name];

          return [name, versionFromRoot];
        })
        .map(([pkg, version]) => comparePackageVersionToLatest(pkg, version))
    );

    const logContext = `${f.padEnd(maxFileNameLength)}`;

    results.forEach((r) => {
      if (r.outdated) {
        console.log(
          `${logContext} ⚠️ ${chalk.bold(
            r.package
          )} has new version ${chalk.bold(r.latest)} (current: ${r.prev})`
        );
      }
      if (r.invalid) {
        hasError = true;
        console.log(
          `${logContext} ❗ ${chalk.bold(r.package)} has an invalid version (${
            r.prev
          }) specified. Latest is ${r.latest}.`
        );
      }
    });
  }

  if (hasError) {
    throw new Error('Invalid versions of packages found (please see above).');
  }
}
