import Errno from './Errno';
import KnownErrorsExtras from './types/KnownErrorsExtras';
import KnownErrorsMessages from './types/KnownErrorsMessages';

const identityOrFn = (val: any, defaultVal: any = {}) => {
  if (typeof val === 'function') {
    return val() || defaultVal;
  }
  return val || defaultVal;
};

const genError =
  (
    messages: KnownErrorsMessages | (() => KnownErrorsMessages),
    extras?: KnownErrorsExtras | (() => KnownErrorsExtras)
  ) =>
  (code: string, extra?: any) =>
    new Errno(
      identityOrFn(messages)[code],
      code,
      extra || identityOrFn(extras)[code]
    );

export default genError;
