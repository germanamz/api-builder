#!/usr/bin/env node
/* eslint-disable import/first */
require('ts-node').register({
  project: `${process.cwd()}/tsconfig.json`,
});

import minimist from 'minimist';

import registry, { DefaultPipelines } from './index';

const {
  _: [actionToExecute],
  ...argv
} = minimist(process.argv.slice(2));

registry
  .execute(actionToExecute as DefaultPipelines, argv as any)
  .catch((e) => {
    console.error(e);
    throw e;
  });
