import { RestEvent } from '../types/RestEvent';
import { RestHandlerEvent } from '../types/RestHandlerEvent';
import entriesToObject from './entriesToObject';

const prepareEventForHandler = (event: RestEvent): RestHandlerEvent => {
  const preparedEvent: RestHandlerEvent = { ...event };
  const contentType =
    event.headers['content-type'] || event.headers['Content-Type'];

  if (event.body) {
    switch (contentType) {
      case 'application/json':
        preparedEvent.body = JSON.parse(event.body);
        break;

      case 'application/x-www-form-urlencoded':
        preparedEvent.body = entriesToObject(
          new URLSearchParams(event.body).entries()
        );
        break;

      default:
        preparedEvent.body = event.body;
    }
  }

  return preparedEvent;
};

export default prepareEventForHandler;
