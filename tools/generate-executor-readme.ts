import {
  ExecutorsJson,
  joinPathFragments,
  readJsonFile,
  workspaceRoot,
  Workspaces,
} from '@nrwl/devkit';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { dirname } from 'path';
import type ExecutorSchema from '../packages/nx-pwm/src/executors/version-check/schema.json';

const { root } = new Workspaces(workspaceRoot).readWorkspaceConfiguration()
  .projects['nx-pwm'];

const executorsJson = readJsonFile<ExecutorsJson>(
  joinPathFragments(root, 'executors.json')
);

const executors = Object.entries({
  ...executorsJson.builders,
  ...executorsJson.executors,
});

const NL = `\n\n`;

const readmeFiles: string[] = [];

for (const [executorName, { schema: schemaPath }] of executors) {
  const schema = readJsonFile<typeof ExecutorSchema>(
    joinPathFragments(workspaceRoot, root, schemaPath)
  );

  let str = `# \`${executorName}\` executor${NL}${schema.description}`.trim();

  const properties = Object.entries(schema.properties ?? {});

  if (properties.length) {
    str += `${NL}## Inputs`;

    for (const [propertyName, property] of properties) {
      const { type, description } = property;
      str += `${NL}### \`${propertyName}\`${NL}${description}${NL}`;

      const propertyRequired = !!(schema.required as string[])?.includes(
        propertyName
      );

      const defaultValue =
        'default' in property ? `\`${property.default}\`` : '';

      str += `
| Type | Required | Default Value |
|:-:|:-:|:-:|
| \`${type}\` | \`${propertyRequired}\` | ${defaultValue} |
`;
    }
  }

  const executorDir = dirname(schemaPath);
  const readmeFilePath = joinPathFragments(
    workspaceRoot,
    root,
    executorDir,
    'README.md'
  );

  writeFileSync(readmeFilePath, str);
  readmeFiles.push(readmeFilePath);
}

execSync(`yarn nx format:write --files=${readmeFiles.join(',')}`);
