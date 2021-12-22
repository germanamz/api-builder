import Context from './Context';

type Stage<C extends Context = Context> = (
  ctx: C
) => Promise<Partial<C>> | Promise<void>;

export default Stage;
