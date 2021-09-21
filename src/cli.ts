#!/usr/bin/env node
import minimist from 'minimist';

import registry from './index';

const {
  _: [actionToExecute],
  ...argv
} = minimist(process.argv.slice(2));

registry.execute(actionToExecute, argv).catch((e) => {
  console.error(e);
  throw e;
});
