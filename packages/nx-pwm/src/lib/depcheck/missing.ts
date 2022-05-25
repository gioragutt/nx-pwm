import depcheck from 'depcheck';
import { PackageJson } from 'nx/src/utils/package-json';
import { NxPwmConfig } from '../config';
import { isIgnored } from './ignore';

export interface MissingDependency {
  packageName: string;
  rootVersion: string;
}

export async function getMissingDependencies(
  config: NxPwmConfig,
  name: string,
  path: string,
  { dependencies = {}, peerDependencies = {} }: PackageJson,
  { devDependencies: rootDependencies }: PackageJson
): Promise<MissingDependency[]> {
  const options: depcheck.Options = {
    /**
     * If a dependency is exclusively used via a TypeScript type import
     * e.g. `import type { Foo } from 'bar';`
     * ...then we do not want it to trigger a missing dependency warning
     * because it is not required at runtime.
     *
     * We can achieve this by overriding the default detector for
     * ImportDeclaration nodes to check the `importKind` value.
     */
    detectors: [
      ...Object.entries(depcheck.detector).map(([detectorName, detectorFn]) => {
        // Use all the default detectors, apart from 'importDeclaration'
        if (detectorName !== 'importDeclaration') {
          return detectorFn;
        }
        const customImportDeclarationDetector: depcheck.Detector = (node) => {
          return node.type === 'ImportDeclaration' &&
            node.source &&
            node.source.value &&
            node.importKind !== 'type'
            ? [node.source.value]
            : [];
        };
        return customImportDeclarationDetector;
      }),
    ],
    skipMissing: false, // skip calculation of missing dependencies
    ignorePatterns: [
      '*.d.ts',
      '.eslintrc.json',
      '*.spec*',
      'src/schematics/**/files/**',
      'src/generators/**/files/**',
      'src/migrations/**',
    ],
    package: { dependencies, peerDependencies },
  };

  const { missing } = await depcheck(path, options);

  return Object.keys(missing)
    .filter((m) => !isIgnored(name, m, config.depcheck.ignore.missing))
    .map((packageName) => ({
      packageName,
      rootVersion: rootDependencies[packageName],
    }));
}
