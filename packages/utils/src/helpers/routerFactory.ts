import { SupportedHttpMethodsSet } from '../constants/SupportedHttpMethods';
import { RestHandler } from '../types/RestHandler';
import internalHandlerWrapper from './internalHandlerWrapper';
import marshalEvent from './marshalEvent';

const routerFactory = <C extends { isDev: boolean }>(
  methods: {
    [method in SupportedHttpMethodsSet]: RestHandler<any>;
  },
  buildCtx?: C
): RestHandler => {
  const wrappedHandlers: any = Object.entries(methods).reduce(
    (acc, [method, handler]) => ({
      ...acc,
      [method]: internalHandlerWrapper(handler),
    }),
    {}
  );
  const eventMarshaller = marshalEvent<C>(buildCtx);
  return async (event, ctx) => {
    const { httpMethod } = event;
    const methodHandler =
      wrappedHandlers[httpMethod as SupportedHttpMethodsSet];

    return methodHandler(eventMarshaller(event), ctx);
  };
};

export default routerFactory;
