import path from 'path';

import { joinPathFragments } from '@nrwl/devkit';
import {
  MigrationsJson,
  PackageJsonUpdates,
} from 'nx/src/config/misc-interfaces';
import {
  fileExists,
  readJsonFile,
  writeJsonFile,
} from 'nx/src/utils/fileutils';
import {
  NxMigrationsConfiguration,
  PackageJson,
} from 'nx/src/utils/package-json';

import { VersionComparisonResult } from './compare-package-version-to-latest';

const versionPlaceholder = 'x.y.z';
const placeholderPackageJsonUpdate: PackageJsonUpdates = {
  [versionPlaceholder]: { version: versionPlaceholder, packages: {} },
};

function ensurePackageJsonDeclaresMigrations(
  packageJsonPath: string,
  migrationsPath: string
): void {
  const packageJson = readJsonFile<PackageJson>(packageJsonPath);
  if (typeof packageJson['nx-migrations'] === 'string') {
    return;
  }

  const migrations: NxMigrationsConfiguration =
    packageJson['nx-migrations'] ?? {};

  migrationsPath = `./${path.relative(
    path.dirname(packageJsonPath),
    migrationsPath
  )}`;

  if (migrations.migrations === migrationsPath) {
    return;
  }

  migrations.migrations = migrationsPath;
  packageJson['nx-migrations'] = migrations;
  writeJsonFile(packageJsonPath, packageJson);
}

function readMigrationsJson(path: string): Omit<MigrationsJson, 'version'> {
  if (!fileExists(path)) {
    return {
      packageJsonUpdates: placeholderPackageJsonUpdate,
    };
  }
  const migrations = readJsonFile<MigrationsJson>(path);
  migrations.packageJsonUpdates = {
    ...placeholderPackageJsonUpdate,
    ...migrations.packageJsonUpdates,
  };
  return migrations;
}

export function createOrUpdateMigrations(
  projectRoot: string,
  comparisons: VersionComparisonResult[]
) {
  const migrationsJsonPath = joinPathFragments(projectRoot, 'migrations.json');

  ensurePackageJsonDeclaresMigrations(
    joinPathFragments(projectRoot, 'package.json'),
    migrationsJsonPath
  );

  const migrations = readMigrationsJson(migrationsJsonPath);
  const packageUpdates =
    migrations.packageJsonUpdates[versionPlaceholder].packages;

  for (const comparison of comparisons) {
    if (comparison.outdated) {
      packageUpdates[comparison.package] = {
        version: comparison.latest,
        alwaysAddToPackageJson: false,
      };
    }
  }

  writeJsonFile(migrationsJsonPath, migrations);
}
