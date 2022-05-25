import { PackageJson } from 'nx/src/utils/package-json';
import { satisfies } from 'semver';
import { NxPwmConfig } from '../config';
import { isIgnored } from './ignore';

export interface VersionDiscrepancy {
  packageName: string;
  rootVersion: string;
  projectVersion: string;
}

function findDiscrepancies(
  projectDependencies: Record<string, string>,
  rootDependencies: Record<string, string>,
  isNotIgnored: (dep: string) => boolean
): VersionDiscrepancy[] {
  return Object.keys(projectDependencies)
    .filter(isNotIgnored)
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
  return (
    rootDeps[dep] &&
    projectDependencies[dep] !== rootDeps[dep] &&
    !satisfies(rootDeps[dep], projectDependencies[dep])
  );
}

export function getDiscrepancies(
  config: NxPwmConfig,
  name: string,
  { dependencies = {}, peerDependencies = {} }: PackageJson,
  { devDependencies }: PackageJson
) {
  const isNotIgnored = (dep: string) =>
    !isIgnored(name, dep, config.depcheck.ignore.discrepancies);

  return [
    ...findDiscrepancies(dependencies, devDependencies, isNotIgnored),
    ...findDiscrepancies(peerDependencies, devDependencies, isNotIgnored),
  ];
}
