export class FinishUploadArgs {

    /** If the uploaded file should be persisted to long term storage, default `false` */
    persist?: boolean;

    /** If the uploaded file should be made public. The returned url will never expire */
    publicFile?: boolean;

    key: string;
  }