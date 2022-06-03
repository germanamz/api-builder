import { RestEvent } from '../types/RestEvent';

const prepareEventForHandler = (event: RestEvent) => {
  const preparedEvent = { ...event };

  if (event.body && event.headers['content-type'] === 'application/json') {
    preparedEvent.body = JSON.parse(event.body);
  }

  return preparedEvent;
};

export default prepareEventForHandler;
