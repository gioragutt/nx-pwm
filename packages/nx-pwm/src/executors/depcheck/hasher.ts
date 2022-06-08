import { CustomHasher, HasherContext, Task } from '@nrwl/devkit';
import {
  nxPwmConfigExists,
  NX_PWM_CONFIG_PATH,
  readNxPwmConfig,
} from '../../lib/config';

function hashNxPwmConfigDepcheckSectionForProject(
  task: Task,
  context: HasherContext
) {
  const nxPwmConfig = readNxPwmConfig();

  const missingForAll = nxPwmConfig?.depcheck?.ignore?.missing?.['*'] ?? [];
  const missingForProject =
    nxPwmConfig?.depcheck?.ignore?.missing?.[task.target.project] ?? [];

  const discrepanciesForAll =
    nxPwmConfig?.depcheck?.ignore?.discrepancies?.['*'] ?? [];
  const discrepanciesForProject =
    nxPwmConfig?.depcheck?.ignore?.discrepancies?.[task.target.project] ?? [];

  return {
    value: context.hasher.hashArray([
      ...missingForAll,
      ...missingForProject,
      ...discrepanciesForAll,
      ...discrepanciesForProject,
    ]),
    implicitDeps: {
      [NX_PWM_CONFIG_PATH]: context.hasher.hashFile(NX_PWM_CONFIG_PATH),
    },
  };
}

export const depcheckHasher: CustomHasher = async (task, context) => {
  const baseHash = await context.hasher.hashTaskWithDepsAndContext(task);

  if (!nxPwmConfigExists()) {
    return baseHash;
  }

  const { implicitDeps, value } = hashNxPwmConfigDepcheckSectionForProject(
    task,
    context
  );

  return {
    value: context.hasher.hashArray([baseHash.value, value]),
    details: {
      ...baseHash.details,
      ...implicitDeps,
    },
  };
};

export default depcheckHasher;
