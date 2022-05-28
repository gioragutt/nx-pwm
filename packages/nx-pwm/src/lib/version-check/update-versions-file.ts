import { readFileSync, writeFileSync } from 'fs';
import { VariableVersionComparisonResult } from './versions-files-check';

export function updateVersionsFile(
  file: string,
  outdatedDependencies: VariableVersionComparisonResult[]
) {
  let versionsContent = readFileSync(file).toString();

  // TODO: update this with ts-morph or something else
  for (const { variable, prev, latest } of outdatedDependencies) {
    versionsContent = versionsContent.replace(
      `${variable} = '${prev}'`,
      `${variable} = '${latest}'`
    );
  }

  writeFileSync(file, versionsContent);
}
