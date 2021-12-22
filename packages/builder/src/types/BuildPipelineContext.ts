import CommonPipelineContext from './CommonPipelineContext';

type BuildPipelineContext = CommonPipelineContext & {
  routersPaths: string[];
};

export default BuildPipelineContext;
