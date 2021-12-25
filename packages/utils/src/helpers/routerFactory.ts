import { SupportedHttpMethodsSet } from '../constants/SupportedHttpMethods';
import Handler from '../types/Handler';
import internalHandlerWrapper from './internalHandlerWrapper';
import marshalEvent from './marshalEvent';

const routerFactory = <C extends { isDev: boolean }>(
  methods: {
    [method in SupportedHttpMethodsSet]: Handler<any>;
  },
  buildCtx?: C
): Handler => {
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
