export default class Errno extends Error {
  code: string;

  extra?: any;

  parent?: Errno;

  readonly isErrno = true;

  constructor(message: string, code: string, extra?: any, parent?: Errno) {
    super(message);
    this.code = code;
    this.extra = extra;
    this.parent = parent;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
