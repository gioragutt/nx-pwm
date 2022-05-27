import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { VersionType } from '../../lib/config';
import { depcheckVersion, verdaccioVersion } from '../../utils/versions';
import generator from './generator';

describe('install generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);
  });

  it.each(['independent', 'synced'] as VersionType[])(
    'should setup .nx-pwm.json',
    async (versionType) => {
      await generator(tree, { versionType });

      expect(readJson(tree, '.nx-pwm.json')).toMatchObject({
        $schema: './node_modules/nx-pwm/config-schema.json',
        versionType,
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
      });
    }
  );

  it('should setup local registry files', async () => {
    await generator(tree, { versionType: 'independent' });

    expect(tree.exists('.verdaccio/config.yml')).toBeTruthy();
    expect(tree.exists('.verdaccio/htpasswd')).toBeTruthy();
    expect(tree.exists('tools/local-registry.sh')).toBeTruthy();
  });

  it('should update package.json correctly', async () => {
    await generator(tree, { versionType: 'independent' });

    expect(readJson(tree, 'package.json')).toMatchObject({
      scripts: {
        'local-registry': './tools/local-registry.sh',
      },
      devDependencies: {
        depcheck: depcheckVersion,
        verdaccio: verdaccioVersion,
      },
    });
  });
});
