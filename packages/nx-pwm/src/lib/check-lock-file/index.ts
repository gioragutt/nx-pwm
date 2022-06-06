import { detectPackageManager, output, PackageManager } from '@nrwl/devkit';
import { existsSync, readFileSync } from 'fs';

export const lockFiles: Record<PackageManager, string> = {
  npm: 'package-lock.json',
  pnpm: 'pnpm-lock.yaml',
  yarn: 'yarn.lock',
};

export const registries: Record<PackageManager, string> = {
  npm: 'registry.npmjs.org',
  pnpm: 'registry.npmjs.org', // TODO: validate this,
  yarn: 'registry.yarnpkg.com',
};

export function* checkLockFiles(pm: PackageManager) {
  const correctLockFile = lockFiles[pm];
  const incorrectLockFiles = Object.entries(lockFiles)
    .filter(([k]) => k !== pm)
    .map(([, lockFiles]) => lockFiles);

  for (const lockFile of incorrectLockFiles) {
    if (existsSync(lockFile)) {
      yield `Invalid occurrence of "${lockFile}" file. Please remove it and use only "${correctLockFile}"`;
    }
  }

  try {
    const content = readFileSync(correctLockFile, 'utf-8');
    if (content.match(/localhost:487/)) {
      yield `The "${correctLockFile}" file has reference to local registry ("localhost:4873"). Please use "${registries[pm]}" in "${correctLockFile}"`;
    }
  } catch {
    yield `The "${correctLockFile}" does not exist or cannot be read`;
  }
}

export function executeLockFileCheck() {
  const pm = detectPackageManager();
  const errors = [...checkLockFiles(pm)];

  if (errors.length === 0) {
    output.success({ title: 'Lock file is valid' });
    process.exit(0);
  }

  output.error({
    title: 'Lock file check failed',
    bodyLines: errors,
  });
  process.exit(1);
}
