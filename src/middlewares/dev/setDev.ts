import BuildPipelineArgv from '../../types/argvs/DevPipelineArgv';
import Middleware from '../../types/Middleware';

const setDev: Middleware<null, 'isDev', BuildPipelineArgv> = async () => ({
  isDev: true,
});

export default setDev;
