import {
  joinPathFragments,
  readJsonFile,
  workspaceRoot,
  Workspaces,
} from '@nrwl/devkit';
import { existsSync } from 'fs';
import {
  isPublishablePackageJson,
  PublishablePackageJson,
} from './package-json';

export const workspace = new Workspaces(
  workspaceRoot
).readWorkspaceConfiguration();

function packageJsonOfLib(path: string): PublishablePackageJson {
  return existsSync(path) && readJsonFile(path);
}

export function outputPathForLib(lib: string) {
  return workspace.projects[lib].targets.build.options.outputPath;
}

export const publishableProjects = Object.fromEntries(
  Object.entries(workspace.projects)
    .map(
      ([name, config]) =>
        [
          name,
          packageJsonOfLib(joinPathFragments(config.root, 'package.json')),
        ] as const
    )
    .filter(([, packageJson]) => isPublishablePackageJson(packageJson))
);

export const nameToPackageJson = Object.fromEntries(
  Object.values(publishableProjects).map((p) => [p.name, p])
);

export const namesOfPublishableLibraries = Object.values(
  publishableProjects
).map((p) => p.name);
