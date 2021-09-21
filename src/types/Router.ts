export interface Router {
  basename: string;
  path: string;
  outFsAbsPath: string;
  zipFilePath: string;
  checksumFilePath: string;
  lambdaName: string;
  artifact: string;
  statements: any[];
}
