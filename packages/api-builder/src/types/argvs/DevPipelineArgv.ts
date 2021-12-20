import CommonPipelineArgv from './CommonPipelineArgv';

type BuildPipelineArgv = CommonPipelineArgv & {
  port?: number;
};

export default BuildPipelineArgv;
