/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tree, updateJson } from '@nrwl/devkit';
import { addLocalRegistryNpmScript } from '../../generators/install/lib/add-local-registry-npm-script';
import { NX_PWM_CONFIG_PATH } from '../../lib/config';

export default function update(tree: Tree) {
  addLocalRegistryNpmScript(tree);

  updateJson(tree, NX_PWM_CONFIG_PATH, (json) => {
    if (!json['localRegistry']) {
      json['localRegistry'] = {
        verdaccioConfig: '.verdaccio/config.yml',
      };
    }
    return json;
  });

  tree.delete('tools/local-registry.sh');
}
