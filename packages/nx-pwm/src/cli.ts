#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as localRegistry from './lib/local-registry';

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
        (builder) =>
          builder.option('scope', {
            type: 'string',
            demandOption: false,
            alias: 's',
            description: 'npm scope to check. omit for none',
          }),
        (args) => {
          localRegistry.logCurrentRegistry(args.scope);
        }
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
  .strict()
  .recommendCommands()
  .help()
  .wrap(yargs.terminalWidth())
  .epilogue(EPILOGUE).argv;
