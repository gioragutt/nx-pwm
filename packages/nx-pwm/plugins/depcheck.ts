import { joinPathFragments, ProjectConfiguration } from '@nrwl/devkit';
import { fileExists, readJsonFile } from 'nx/src/utils/fileutils';
import { dirname } from 'path';

export const projectFilePatterns = ['project.json'];

function isPublishableProject(file: string) {
  const packageJsonPath = joinPathFragments(dirname(file), 'package.json');
  return (
    fileExists(packageJsonPath) && readJsonFile(packageJsonPath).publishConfig
  );
}

export const registerProjectTargets = (
  file: string
): ProjectConfiguration['targets'] => {
  if (!isPublishableProject(file)) {
    return;
  }

  return {
    depcheck: {
      executor: 'nx-pwm:depcheck',
      options: {},
    },
  };
};
