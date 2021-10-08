import { Handler } from '../types/Handler';
import SupportedHttpMethods from '../types/SupportedHttpMethods';
import internalHandlerWrapper from './internalHandlerWrapper';

const routerFactory = (
  errorMessages: Record<string, string>,
  errorStatuses: Record<string, number>,
  methods: { [method in SupportedHttpMethods]: Handler<any> }
): Handler => {
  const wrappedHandlers: any = Object.entries(methods).reduce(
    (acc, [method, handler]) => ({
      ...acc,
      [method]: internalHandlerWrapper(errorMessages, errorStatuses, handler),
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
