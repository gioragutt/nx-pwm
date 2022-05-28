import { workspaceRoot } from '@nrwl/devkit';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
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

async function checkFiles(config: VersionsFilesCheckConfig, files: string[]) {
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
  const versions = getVersions(f);
  const npmPackages = getPackages(config, versions);
  const results = await Promise.all(
    npmPackages.map(async ({ variable, pkg, version }) => ({
      variable,
      ...(await comparePackageVersionToLatest(pkg, version)),
    }))
  );
  return results;
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
