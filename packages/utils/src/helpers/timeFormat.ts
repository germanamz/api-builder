import getShortMonth from './getShortMonth';

const timeFormat = (date: Date) =>
  `${date.getDate()}/${getShortMonth(
    date
  )}/${date.getFullYear()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} +${date.getMilliseconds()}`;

export default timeFormat;
