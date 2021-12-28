#!/usr/bin/env node
/* eslint-disable import/first */
require('ts-node').register({
  project: `${process.cwd()}/tsconfig.json`,
});

import registry from '@the-api-builder/builder';
import minimist from 'minimist';

const {
  _: [actionToExecute],
  ...argv
} = minimist(process.argv.slice(2));

registry.execute(actionToExecute, argv as any).catch((e: any) => {
  console.error(e);
  throw e;
});
