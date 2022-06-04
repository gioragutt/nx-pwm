import { output } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import {
  detectPackageManager,
  getPackageManagerCommand,
  PackageManager,
} from 'nx/src/utils/package-manager';
import { relative, resolve } from 'path';
import { execAsync, getOutputAsync } from '../../utils/exec';
import { rimrafAsync } from '../../utils/rimraf';
import { readNxPwmConfig } from '../config';

const getVerdaccioConfig = () =>
  readNxPwmConfig().localRegistry.verdaccioConfig;

const localRegistryUrl = 'http://localhost:4873/';

async function runOnPackageMangers<T>(
  action: (pm: PackageManager) => Promise<T>
): Promise<T[]> {
  const pm = detectPackageManager();

  const packageManagersToInvoke = [...new Set([pm, 'npm'])];

  return await Promise.all(packageManagersToInvoke.map(action));
}

export async function enableLocalRegistry() {
  const pmc = getPackageManagerCommand();

  output.log({
    title: 'Enabling local registry',
    bodyLines: [
      `Setting the url to ${localRegistryUrl}.`,
      `To disable local registry, run: "${pmc.exec} nx-pwm local-registry disable"`,
      `To check what registry your package manager is using, run: "${pmc.exec} nx-pwm local-registry status"`,
    ],
  });

  await runOnPackageMangers((pm) =>
    execAsync(`${pm} config set registry ${localRegistryUrl}`)
  );
}

export async function disableLocalRegistry() {
  const pmc = getPackageManagerCommand();

  output.log({
    title: 'Disabling local registry',
    bodyLines: [
      `Setting the url to default.`,
      `To enable local registry, run: "${pmc.exec} nx-pwm local-registry enable"`,
      `To check what registry your package manager is using, run: "${pmc.exec} nx-pwm local-registry status"`,
    ],
  });

  await runOnPackageMangers((pm) => execAsync(`${pm} config delete registry`));
}

export async function logCurrentRegistry(scope: string | undefined) {
  const prefix = scope ? `@${scope}:` : '';

  const registries = await runOnPackageMangers(async (pm) => ({
    pm,
    registry: await getOutputAsync(`${pm} config get ${prefix}registry`),
  }));

  const pmNameLength = Math.max(...registries.map((r) => r.pm.length)) + 1;

  output.note({
    title: `Registries in use by your package managers${
      scope ? ` for @${scope}` : ''
    }:`,
    bodyLines: registries.map(
      ({ pm, registry }) => `> ${`${pm}:`.padEnd(pmNameLength)} ${registry}`
    ),
  });
}

export function startLocalRegistryBlocking() {
  const verdaccioConfig = getVerdaccioConfig();

  output.log({
    title: 'Starting local registry',
    bodyLines: [
      `To stop local registry, stop the process by pressing Ctrl+C.`,
      `The verdaccio config file is located at ${verdaccioConfig}`,
    ],
  });

  const pmc = getPackageManagerCommand();

  execSync(`${pmc.exec} --silent verdaccio --config ${verdaccioConfig}`, {
    env: { ...process.env, VERDACCIO_HANDLE_KILL_SIGNALS: 'true' },
    stdio: 'inherit',
  });
}

export async function clearLocalRegistryCache() {
  const verdaccioConfig = getVerdaccioConfig();

  const { storage } = load(await readFile(verdaccioConfig, 'utf-8')) as {
    storage: string;
  };

  const storagePath = resolve(verdaccioConfig, '..', storage);

  output.log({
    title: 'Clearing local registry cache',
    bodyLines: [
      `The local registry cache is located at ${relative('.', storagePath)}`,
    ],
  });

  await rimrafAsync(storagePath);
}
