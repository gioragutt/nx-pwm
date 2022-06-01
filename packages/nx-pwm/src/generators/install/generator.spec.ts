import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import Ajv from 'ajv';
import configSchema from '../../../config-schema.json';
import { VersionType } from '../../lib/config';
import { depcheckVersion, verdaccioVersion } from '../../utils/versions';
import generator from './generator';

const ajv = new Ajv();

describe('install generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace(2);
  });

  it.each(['independent', 'synced'] as VersionType[])(
    'should setup .nx-pwm.json',
    async (versionType) => {
      await generator(tree, { versionType });

      const config = readJson(tree, '.nx-pwm.json');

      expect(config).toMatchObject({
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

      const validate = ajv.compile(configSchema);
      validate(config);
      expect(validate.errors).toBeFalsy();
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
