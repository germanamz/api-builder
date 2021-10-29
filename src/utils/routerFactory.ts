import { Handler } from '../types/Handler';
import SupportedHttpMethods from '../types/SupportedHttpMethods';
import internalHandlerWrapper from './internalHandlerWrapper';

const routerFactory = (methods: {
  [method in SupportedHttpMethods]: Handler<any>;
}): Handler => {
  const wrappedHandlers: any = Object.entries(methods).reduce(
    (acc, [method, handler]) => ({
      ...acc,
      [method]: internalHandlerWrapper(handler),
    }),
    {}
  );
  return async (event, ctx) => {
    const { httpMethod } = event;
    const methodHandler = wrappedHandlers[httpMethod as SupportedHttpMethods];

    return methodHandler(event, ctx);
  };
};

export default routerFactory;
