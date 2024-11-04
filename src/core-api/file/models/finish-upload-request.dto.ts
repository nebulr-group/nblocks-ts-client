export class FinishUploadRequestDto {
  /** If the uploaded file should be persisted to long term storage, default `false` */
  persist?: boolean;
  tenantId: string;
  key: string;
}