import { readJson, Tree, writeJson } from '@nrwl/devkit';
import { createTree } from '@nrwl/devkit/testing';
import generator from './0.2.5-remove-local-registry-field-from-config';

describe('0.2.5-remove-local-registry-field-from-config', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it.each(['local-registry', 'localRegistry'])(
    'should run successfully',
    async (field) => {
      const goodConfig = {
        $schema: './node_modules/nx-pwm/config-schema.json',
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

      writeJson(tree, '.nx-pwm.json', {
        ...goodConfig,
        [field]: {
          some: 'thing',
        },
      });

      generator(tree);

      expect(readJson(tree, '.nx-pwm.json')).toStrictEqual(goodConfig);
    }
  );
});
