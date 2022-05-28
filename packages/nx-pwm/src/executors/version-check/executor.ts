import { ExecutorContext } from '@nrwl/devkit';
import { readNxPwmConfig } from '../../lib/config';
import { NormalizedVersionCheckOptions } from '../../lib/version-check';
import { performVersionsFileCheck } from './lib/perform-versions-file-check';
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
      ...config.versionCheck.versionsFiles,
      excludeVariables:
        config.versionCheck?.versionsFiles?.excludeVariables ?? [],
      scopes: normalizeScopes(config.versionCheck?.versionsFiles?.scopes),
    },
  };

  /**
   * TODO:
   * - add --fix option
   * - add package.json check
   */

  let success = true;

  if (options.checkVersionsFiles) {
    success = await performVersionsFileCheck(
      normalizedConfig,
      projectRoot,
      options
    );
  }

  return { success };
}
