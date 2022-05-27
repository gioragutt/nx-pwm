import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { depcheckVersion, verdaccioVersion } from '../../utils/versions';
import { InstallGeneratorSchema } from './schema';

function addFiles(tree: Tree, options: InstallGeneratorSchema) {
  const templateOptions = {
    ...options,
    tmpl: '',
  };

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    '/',
    templateOptions
  );
}

export async function installGenerator(
  tree: Tree,
  options: InstallGeneratorSchema
) {
  addFiles(tree, options);
  addDependenciesToPackageJson(
    tree,
    {},
    {
      depcheck: depcheckVersion,
      verdaccio: verdaccioVersion,
    }
  );

  updateJson(tree, 'package.json', (json) => {
    json.scripts ??= {};
    json.scripts['local-registry'] = './tools/local-registry.sh';
    return json;
  });

  await formatFiles(tree);

  return () => installPackagesTask(tree);
}

export default installGenerator;
