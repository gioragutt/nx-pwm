import {
  addDependenciesToPackageJson,
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  Tree,
} from '@nrwl/devkit';
import { depcheckVersion, verdaccioVersion } from '../../utils/versions';
import { addLocalRegistryNpmScript } from './lib/add-local-registry-npm-script';
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

  addLocalRegistryNpmScript(tree);

  await formatFiles(tree);

  return () => installPackagesTask(tree);
}

export default installGenerator;
