import { getPackageManagerCommand, Tree, updateJson } from '@nrwl/devkit';
import { detectPackageManagerInTree } from './package-manager';

export function addLocalRegistryNpmScript(tree: Tree) {
  const pmc = getPackageManagerCommand(detectPackageManagerInTree(tree));

  updateJson(tree, 'package.json', (json) => {
    json.scripts ??= {};
    json.scripts['local-registry'] = `${pmc.exec} nx-pwm local-registry`;
    return json;
  });
}
