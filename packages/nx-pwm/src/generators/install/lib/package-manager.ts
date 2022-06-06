import { joinPathFragments, PackageManager, Tree } from '@nrwl/devkit';

export function detectPackageManagerInTree(
  tree: Tree,
  dir = ''
): PackageManager {
  return tree.exists(joinPathFragments(dir, 'yarn.lock'))
    ? 'yarn'
    : tree.exists(joinPathFragments(dir, 'pnpm-lock.yaml'))
    ? 'pnpm'
    : 'npm';
}
