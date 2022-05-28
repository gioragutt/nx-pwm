import { readJsonFile } from '@nrwl/devkit';
import { fileExists } from 'nx/src/utils/fileutils';
import { PackageJson } from 'nx/src/utils/package-json';
import { nameToPackageJson } from '../workspace-utils';
import {
  comparePackageVersionToLatest,
  VersionComparisonResult,
} from './compare-package-version-to-latest';

export async function packageJsonCheck(
  packageJsonPath: string
): Promise<VersionComparisonResult[]> {
  if (!fileExists(packageJsonPath)) {
    throw new Error(`Could not find ${packageJsonPath}`);
  }

  const rootPackageJson = readJsonFile<PackageJson>('package.json');
  const packageJsonContent = readJsonFile<PackageJson>(packageJsonPath);

  const results = await Promise.all(
    Object.entries({
      ...packageJsonContent.dependencies,
      ...packageJsonContent.devDependencies,
      ...packageJsonContent.peerDependencies,
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

  return results;
}
