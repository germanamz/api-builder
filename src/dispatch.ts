let currentCtx: any;

export function prepareToUseHooks(ctx: any) {
  currentCtx = ctx;
  return currentCtx;
}

export function resolveCurrentCtx() {
  return currentCtx;
}
