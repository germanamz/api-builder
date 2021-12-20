import genErrorFactory from './genError';
import { getExtras } from './globalExtras';
import { getMessages } from './globalMessages';

export { default as Errno } from './Errno';
export {
  ErrnoErrorCodes,
  default as ErrnoErrors,
  ErrnoErrorsExtras,
  ErrnoErrorsMessages,
} from './ErrnoErrors';
export * from './globalExtras';
export * from './globalMessages';
export type { default as KnownErrors } from './types/KnownErrors';
export type { default as KnownErrorsMessages } from './types/KnownErrorsMessages';

const genError = genErrorFactory(getMessages, getExtras);

export { genError, genErrorFactory };
