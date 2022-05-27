import { ProjectConfiguration } from '@nrwl/devkit';

export const projectFilePatterns = ['project.json'];

export const registerProjectTargets = (): ProjectConfiguration['targets'] => {
  return {
    depcheck: {
      executor: 'nx-pwm:depcheck',
      options: {},
    },
  };
};
