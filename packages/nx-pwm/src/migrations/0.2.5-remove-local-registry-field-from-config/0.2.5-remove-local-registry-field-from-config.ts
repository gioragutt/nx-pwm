import { readJson, Tree, updateJson } from '@nrwl/devkit';

const configPath = '.nx-pwm.json';
const fieldToRemove = 'local-registry';

export default function update(tree: Tree) {
  if (!tree.exists(configPath)) {
    return;
  }

  const config = readJson(tree, configPath);
  if (!(fieldToRemove in config)) {
    return;
  }

  updateJson(tree, configPath, (json) => {
    delete json[fieldToRemove];
    return json;
  });
}
