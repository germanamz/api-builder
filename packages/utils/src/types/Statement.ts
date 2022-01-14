export type Statement = {
  Sid?: string;
  Action: string | string[];
  Effect: 'Allow' | 'Deny';
  Resource: string | string[];
};
