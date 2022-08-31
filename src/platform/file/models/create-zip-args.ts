import { ZipProps } from "./create-zip-request.dto";

export class CreateZipArgs {
  /**If the file is a public file or not. If true, set provide full url as key value */
  publicFile: boolean;

  /** The archive zipProps */
  zipProps: ZipProps;
};