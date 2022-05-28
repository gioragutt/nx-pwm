import { joinPathFragments } from '@nrwl/devkit';
import {
  MigrationsJson,
  PackageJsonUpdateForPackage,
  PackageJsonUpdates,
} from 'nx/src/config/misc-interfaces';
import {
  fileExists,
  readJsonFile,
  writeJsonFile,
} from 'nx/src/utils/fileutils';
import { VersionComparisonResult } from './compare-package-version-to-latest';

const versionPlaceholder = 'x.y.z';
const placeholderPackageJsonUpdate: PackageJsonUpdates = {
  [versionPlaceholder]: { version: versionPlaceholder, packages: {} },
};

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
