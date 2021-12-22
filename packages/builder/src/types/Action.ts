import CommonArgv from './CommonArgv';
import Context from './Context';

type Action<
  I extends null | keyof Context,
  O = any,
  A extends CommonArgv = CommonArgv
> = (
  ctx: Pick<Context, I extends keyof Context ? I : keyof Context>,
  argv: A
) => Promise<O>;

export default Action;
