type HandlerContext<GAE> = any & {
  genApiError: GAE;
};

export default HandlerContext;
