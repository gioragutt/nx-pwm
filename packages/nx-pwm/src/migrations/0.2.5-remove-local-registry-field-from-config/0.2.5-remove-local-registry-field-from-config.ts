import { readJson, Tree, updateJson } from '@nrwl/devkit';

const configPath = '.nx-pwm.json';
const fieldsToRemove = ['local-registry', 'localRegistry'];

export default function update(tree: Tree) {
  if (!tree.exists(configPath)) {
    return;
  }

  const config = readJson(tree, configPath);
  if (!fieldsToRemove.some((field) => field in config)) {
    return;
  }

  updateJson(tree, configPath, (json) => {
    fieldsToRemove.forEach((field) => delete json[field]);
    return json;
  });
}
