import { PackageJson } from 'nx/src/utils/package-json';
import { satisfies } from 'semver';
import { NxPwmConfig } from '../config';
import { isIgnored } from './ignore';

export interface VersionDiscrepancy {
  packageName: string;
  rootVersion: string;
  projectVersion: string;
}

export function getDiscrepancies(
  config: NxPwmConfig,
  name: string,
  { dependencies = {}, peerDependencies = {} }: PackageJson,
  rootPackageJson: PackageJson
) {
  function findDiscrepancies(
    projectDependencies: Record<string, string>,
    rootDependencies: Record<string, string>
  ): VersionDiscrepancy[] {
    return Object.keys(projectDependencies)
      .filter(
        (dep) => !isIgnored(name, dep, config.depcheck.ignore.discrepancies)
      )
      .filter((p) => isDiscrepancy(p, rootDependencies, projectDependencies))
      .map((packageName) => ({
        packageName: packageName,
        rootVersion: rootDependencies[packageName],
        projectVersion: projectDependencies[packageName],
      }));
  }

  function isDiscrepancy(
    dep: string,
    rootDeps: Record<string, string>,
    projectDependencies: Record<string, string>
  ): unknown {
    const versionInProject = projectDependencies[dep];

    const shouldCheckVersion =
      rootDeps[dep] && versionInProject !== rootDeps[dep];

    if (!shouldCheckVersion) {
      return false;
    }

    if (versionInProject === '*' && !config.depcheck.acceptWildcardVersion) {
      return false;
    }

    return !satisfies(rootDeps[dep], versionInProject);
  }

  const rootDeps = {
    ...rootPackageJson.devDependencies,
    ...rootPackageJson.dependencies,
  };

  return [
    ...findDiscrepancies(dependencies, rootDeps),
    ...findDiscrepancies(peerDependencies, rootDeps),
  ];
}
