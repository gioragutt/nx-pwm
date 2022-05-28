import { ExecutorContext } from '@nrwl/devkit';
import { readNxPwmConfig } from '../../lib/config';
import { NormalizedVersionCheckOptions } from '../../lib/version-check';
import { performPackageJsonCheck } from './lib/perform-package-json-check';
import { performVersionsFilesCheck } from './lib/perform-versions-files-check';
import { VersionCheckExecutorSchema } from './schema';

function normalizeScopes(scopes: string[]) {
  return [
    ...new Set([
      'babel',
      'emotion',
      'reduxjs',
      'swc',
      'testing-library',
      'types',
      'nestjs',
      'openapitools',
      ...(scopes ?? []),
    ]),
  ];
}

export default async function runExecutor(
  options: VersionCheckExecutorSchema,
  { workspace, projectName }: ExecutorContext
) {
  const config = readNxPwmConfig();
  const { root: projectRoot } = workspace.projects[projectName];

  const normalizedConfig: NormalizedVersionCheckOptions = {
    versionsFiles: {
      ...config.versionCheck?.versionsFiles,
      excludeVariables:
        config.versionCheck?.versionsFiles?.excludeVariables ?? [],
      scopes: normalizeScopes(config.versionCheck?.versionsFiles?.scopes),
    },
  };

  const success = [
    options.checkVersionsFiles
      ? await performVersionsFilesCheck(normalizedConfig, projectRoot, options)
      : true,

    options.checkPackageJson
      ? await performPackageJsonCheck(projectRoot)
      : true,
  ].every((r) => r);

  return { success };
}
