import { resolve } from 'path';
import registry from '../src';

process.chdir(resolve('../../feprisa/admin-api'));

registry
  .execute('dev', {
    version: 'dev',
  })
  .then(() => {});
