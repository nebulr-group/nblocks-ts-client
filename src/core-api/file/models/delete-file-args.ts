export class DeleteFileArgs {
  /**If the file is a public file or not. If true, set provide full url as key value */
  publicFile: boolean;

  /** The file key or full url to file (Only for public files) */
  key: string;
}