import CommonPipelineArgv from './argvs/CommonPipelineArgv';
import Context from './Context';

type Middleware<
  I extends null | keyof Context,
  O extends null | keyof Context,
  A extends any = CommonPipelineArgv
> = (
  ctx: Pick<Context, I extends keyof Context ? I : keyof Context>,
  argv: A
) => O extends keyof Context
  ? Promise<Pick<Context, O>>
  : Promise<undefined | void | null>;

export default Middleware;