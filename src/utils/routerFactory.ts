import marshalEvent from '../helpers/marshalEvent';
import Context from '../types/Context';
import { Handler } from '../types/Handler';
import SupportedHttpMethods from '../types/SupportedHttpMethods';
import internalHandlerWrapper from './internalHandlerWrapper';

const routerFactory = (
  methods: {
    [method in SupportedHttpMethods]: Handler<any>;
  },
  buildCtx?: Context
): Handler => {
  const wrappedHandlers: any = Object.entries(methods).reduce(
    (acc, [method, handler]) => ({
      ...acc,
      [method]: internalHandlerWrapper(handler),
    }),
    {}
  );
  const eventMarshaller = marshalEvent(buildCtx);
  return async (event, ctx) => {
    const { httpMethod } = event;
    const methodHandler = wrappedHandlers[httpMethod as SupportedHttpMethods];

    return methodHandler(eventMarshaller(event), ctx);
  };
};

export default routerFactory;
