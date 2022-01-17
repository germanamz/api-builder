import { RestHandler } from '@the-api-builder/utils';

const getTest: RestHandler<any> = async () => ({
  prop1: 'This is a prop',
});

export default getTest;
