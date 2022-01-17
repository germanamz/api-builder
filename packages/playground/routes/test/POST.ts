import { RestHandler } from '@the-api-builder/utils';

const creatTest: RestHandler<any> = async () => ({
  prop1: 'Just a single prop',
  prop2: 'Another prop',
});

export default creatTest;
