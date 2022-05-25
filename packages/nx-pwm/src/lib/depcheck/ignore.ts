import { IgnoreConfig } from '../config';

export function isIgnored(
  projectName: string,
  dependency: string,
  ignoreConfig: IgnoreConfig
): boolean {
  const ignoreForAll = ignoreConfig['*'] || [];
  const ignoreForProject = ignoreConfig[projectName] || [];

  return (
    ignoreForAll.some((ignore) => dependency.match(ignore)) ||
    ignoreForProject.some((ignore) => dependency.match(ignore))
  );
}
