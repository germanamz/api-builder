import { SupportedHttpMethodsSet } from '../constants/SupportedHttpMethods';
import { RestHandler } from '../types/RestHandler';
import internalHandlerWrapper from './internalHandlerWrapper';

const routerFactory = (methods: {
  [method in SupportedHttpMethodsSet]: RestHandler<any>;
}): RestHandler<any> => {
  const wrappedHandlers: any = Object.entries(methods).reduce(
    (acc, [method, handler]) => ({
      ...acc,
      [method]: internalHandlerWrapper(handler),
    }),
    {}
  );
  return async (event, ctx) => {
    const { httpMethod } = event;
    const methodHandler =
      wrappedHandlers[httpMethod as SupportedHttpMethodsSet];

    return methodHandler(event, ctx);
  };
};

export default routerFactory;
