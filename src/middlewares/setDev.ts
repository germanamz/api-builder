import Middleware from '../types/Middleware';

const setDev: Middleware<null, 'isDev'> = async () => ({
  isDev: true,
});

export default setDev;
