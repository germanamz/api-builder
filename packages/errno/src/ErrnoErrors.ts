import KnownErrors from './types/KnownErrors';
import KnownErrorsExtras from './types/KnownErrorsExtras';
import KnownErrorsMessages from './types/KnownErrorsMessages';

export type ErrnoErrorCodes = 'UNKNOWN';

const ErrnoErrors: KnownErrors = {
  UNKNOWN: 'UNKNOWN',
};

export const ErrnoErrorsMessages: KnownErrorsMessages = {
  [ErrnoErrors.UNKNOWN]: 'Unknown error',
};

export const ErrnoErrorsExtras: KnownErrorsExtras = {
  [ErrnoErrors.UNKNOWN]: undefined,
};

export default ErrnoErrors;
