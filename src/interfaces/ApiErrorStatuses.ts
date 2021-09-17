import { ErrnoErrorCodes } from '@feprisa/errno';

type ApiErrorStatuses<KC extends keyof any = ErrnoErrorCodes> = Record<
  KC,
  string | number
>;

export default ApiErrorStatuses;