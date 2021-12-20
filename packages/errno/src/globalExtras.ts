import { ErrnoErrorsExtras } from './ErrnoErrors';
import KnownErrorsExtras from './types/KnownErrorsExtras';

let extras: KnownErrorsExtras = ErrnoErrorsExtras;

export const setExtras = (errorsMessages: KnownErrorsExtras) => {
  extras = errorsMessages;
};

export const extendExtras = (errorsMessages: KnownErrorsExtras) => {
  extras = {
    ...extras,
    ...errorsMessages,
  };
};

export const getExtras = (): KnownErrorsExtras => extras;
