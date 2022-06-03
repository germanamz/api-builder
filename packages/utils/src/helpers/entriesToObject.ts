const entriesToObject = (entries: Iterable<[any, any]>) => {
  const obj: Record<any, any> = {};

  for (const [key, val] of entries) {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(val);
      } else {
        obj[key] = [obj[key], val];
      }
    } else {
      obj[key] = val;
    }
  }

  return obj;
};

export default entriesToObject;
