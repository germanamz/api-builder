import { ErrnoErrorsMessages } from './ErrnoErrors';
import KnownErrorsMessages from './types/KnownErrorsMessages';

let messages: KnownErrorsMessages = ErrnoErrorsMessages;

export const setMessages = (errorsMessages: KnownErrorsMessages) => {
  messages = errorsMessages;
};

export const extendMessages = (errorsMessages: KnownErrorsMessages) => {
  messages = {
    ...messages,
    ...errorsMessages,
  };
};

export const getMessages = (): KnownErrorsMessages => messages;
