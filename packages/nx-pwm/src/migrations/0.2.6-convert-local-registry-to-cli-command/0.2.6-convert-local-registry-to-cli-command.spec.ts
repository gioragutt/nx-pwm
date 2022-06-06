import {
  getPackageManagerCommand,
  PackageManager,
  readJson,
  Tree,
} from '@nrwl/devkit';
import { createTree } from '@nrwl/devkit/testing';
import { lockFiles } from '../../lib/check-lock-file';
import { NX_PWM_CONFIG_PATH } from '../../lib/config';
import generator from './0.2.6-convert-local-registry-to-cli-command';

describe('0.2.6-convert-local-registry-to-cli-command', () => {
  let tree: Tree;

  const configBeforeMigration = {
    versionType: 'independent',
    depcheck: {
      ignore: {
        discrepancies: {
          '*': [],
        },
        missing: {
          '*': [],
        },
      },
    },
  };

  beforeEach(() => {
    tree = createTree();
    tree.write(
      'package.json',
      JSON.stringify({
        scripts: {
          'local-registry': './tools/local-registry.sh',
        },
      })
    );
    tree.write('tools/local-registry.sh', 'some-content');
    tree.write(NX_PWM_CONFIG_PATH, JSON.stringify(configBeforeMigration));
  });

  it('should delete tools/local-registry.sh', () => {
    generator(tree);
    expect(tree.exists('tools/local-registry.sh')).toBe(false);
  });

  /**
   * pnpm not checked because the pmc code runs things with execSync
   */
  const packageManagersToCheck: PackageManager[] = ['npm', 'yarn'];

  it.each(packageManagersToCheck)(
    'should update the local-registry npm-script to use nx-pwm',
    (pm) => {
      tree.write(lockFiles[pm], 'something');
      const { exec } = getPackageManagerCommand(pm);

      generator(tree);

      expect(readJson(tree, 'package.json')).toMatchObject({
        scripts: {
          'local-registry': `${exec} nx-pwm local-registry`,
        },
      });
    }
  );

  it('should add the localRegistry nx-pwm config', () => {
    generator(tree);

    expect(readJson(tree, NX_PWM_CONFIG_PATH)).toStrictEqual({
      ...configBeforeMigration,
      localRegistry: {
        verdaccioConfig: '.verdaccio/config.yml',
      },
    });
  });
});
