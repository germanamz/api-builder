export type SupportedHttpMethodsSet =
  | 'GET'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'PUT';

export const SupportedMethodsArray: SupportedHttpMethodsSet[] = [
  'GET',
  'POST',
  'PATCH',
  'DELETE',
  'PUT',
];

export const SupportedHttpMethods: Record<SupportedHttpMethodsSet, string> = {
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
};

export default SupportedHttpMethods;
