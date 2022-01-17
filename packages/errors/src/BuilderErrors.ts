import type { KnownErrors, KnownErrorsMessages } from '@the-api-builder/errno';
import {
  ErrnoErrorCodes,
  ErrnoErrors,
  ErrnoErrorsMessages,
  extendMessages,
} from '@the-api-builder/errno';

export type BuilderErrorsCodes =
  | ErrnoErrorCodes
  | 'PACKAGE_NOT_FOUND'
  | 'API_CONFIG_NOT_FOUND'
  | 'ROUTER_AS_DIRECTORY'
  | 'METHOD_NOT_SUPPORTED'
  | 'BUILD'
  | 'LOAD';

const BuilderErrors: KnownErrors = {
  ...ErrnoErrors,
  BUILD: 'BUILD',
  LOAD: 'LOAD',
  PACKAGE_NOT_FOUND: 'PACKAGE_NOT_FOUND',
  API_CONFIG_NOT_FOUND: 'API_CONFIG_NOT_FOUND',
  ROUTER_AS_DIRECTORY: 'ROUTER_AS_DIRECTORY',
  METHOD_NOT_SUPPORTED: 'METHOD_NOT_SUPPORTED',
};

export const BuilderErrorsMessages: KnownErrorsMessages = {
  ...ErrnoErrorsMessages,
  BUILD: 'Building error',
  LOAD: 'Load error',
  PACKAGE_NOT_FOUND: 'package.json not found on cwd',
  API_CONFIG_NOT_FOUND:
    'api config not found on cwd (.api., .api.json or .api.ts)',
  METHOD_NOT_SUPPORTED: 'the method your trying to define is not supported',
  ROUTER_AS_DIRECTORY:
    'a router must be defined as a folder and have each supported method defined on independent files (check docs for info).',
};

extendMessages(BuilderErrorsMessages);

export default BuilderErrors;
