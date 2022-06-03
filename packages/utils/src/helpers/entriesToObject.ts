const entriesToObject = (entries: Iterable<[any, any]>) => {
  const obj: Record<any, any> = {};

  for (const [key, val] of entries) {
    obj[key] = val;
  }

  return obj;
};

export default entriesToObject;
