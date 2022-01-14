const parseJson = (data?: any) => {
  if (typeof data !== 'string') {
    return data;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

export default parseJson;
