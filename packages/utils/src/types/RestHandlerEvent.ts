import { RestEvent } from './RestEvent';

export type RestHandlerEvent = RestEvent & {
  body: any;
};
