import type { KnownErrors, KnownErrorsMessages } from '@feprisa/errno';
import {
  ErrnoErrorCodes,
  ErrnoErrors,
  ErrnoErrorsMessages,
  genErrorFactory,
} from '@feprisa/errno';

export type BuilderErrorsCodes =
  | ErrnoErrorCodes
  | 'PACKAGE_NOT_FOUND'
  | 'API_CONFIG_NOT_FOUND'
  | 'ROUTER_AS_DIRECTORY'
  | 'BUILD'
  | 'LOAD';

const BuilderErrors: KnownErrors<BuilderErrorsCodes> = {
  ...ErrnoErrors,
  BUILD: 'BUILD',
  LOAD: 'LOAD',
  PACKAGE_NOT_FOUND: 'PACKAGE_NOT_FOUND',
  API_CONFIG_NOT_FOUND: 'API_CONFIG_NOT_FOUND',
  ROUTER_AS_DIRECTORY: 'ROUTER_AS_DIRECTORY',
};

export const BuilderErrorsMessages: KnownErrorsMessages<BuilderErrorsCodes> = {
  ...ErrnoErrorsMessages,
  BUILD: 'Building error',
  LOAD: 'Load error',
  PACKAGE_NOT_FOUND: 'package.json not found on cwd',
  API_CONFIG_NOT_FOUND: 'api config not found on cwd (.api.js or .api.json)',
  ROUTER_AS_DIRECTORY:
    'a router must be defined as a folder and have each supported method defined on independent files (check docs for info).',
};

const genError = genErrorFactory<BuilderErrorsCodes>(BuilderErrorsMessages);

export const genBuilderError = (code: BuilderErrorsCodes, details?: any) =>
  genError(code, details && { details });

export default BuilderErrors;
