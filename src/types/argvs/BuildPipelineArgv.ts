import CommonPipelineArgv from './CommonPipelineArgv';

type BuildPipelineArgv = CommonPipelineArgv & {
  docker?: boolean;
};

export default BuildPipelineArgv;
