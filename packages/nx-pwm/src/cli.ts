#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as localRegistry from './lib/local-registry';
import * as checkLockFile from './lib/check-lock-file';

const EPILOGUE = `For more information, see https://github.com/gioragutt/nx-pwm`;

yargs(hideBin(process.argv))
  .scriptName('nx-pwm')
  .command('local-registry <command>', 'local registry utilities', (yargs) => {
    yargs
      .epilogue(EPILOGUE)
      .command(
        'start',
        'start local registry',
        localRegistry.startLocalRegistryBlocking
      )
      .command(
        'clear',
        'clear local registry cache',
        localRegistry.clearLocalRegistryCache
      )
      .command(
        'status',
        'status of package managers registry configuration',
        (builder: yargs.Argv) =>
          builder.option('scope', {
            type: 'string',
            demandOption: false,
            alias: 's',
            description: 'npm scope to check. omit for none',
          }),
        localRegistry.logCurrentRegistry
      )
      .command(
        'enable',
        'enable local registry',
        localRegistry.enableLocalRegistry
      )
      .command(
        'disable',
        'disable local registry',
        localRegistry.disableLocalRegistry
      );
  })
  .command(
    'check-lock-file',
    "checks that your workspace's package manager lock file does not reference the lock registry",
    checkLockFile.executeLockFileCheck
  )
  .strict()
  .recommendCommands()
  .help()
  .wrap(yargs.terminalWidth())
  .epilogue(EPILOGUE).argv;
