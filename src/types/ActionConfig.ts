export type RefObj = {
  $ref: string;
};

export type Parameter = {
  name: string;
  in: 'query' | 'path' | 'cookie' | 'header';
  required?: boolean;
};

export type MediaType = {
  schema?: Object | RefObj;
};

export type RequestBody = {
  content: { [contentType: string]: MediaType };
  required: boolean;
};

export type ActionConfig = {
  parameters: (
    | Parameter
    | RefObj
    | MediaType
    | (Parameter & RefObj & MediaType)
  )[];
  requestBody: RequestBody | RefObj;
};
