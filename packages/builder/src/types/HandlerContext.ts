import { Errno } from '@feprisa/errno';

type HandlerContext = any & {
  genApiError: (code: string) => Errno;
};

export default HandlerContext;
