export class CreateZipRequestDto {
  tenantId: string;
  publicFile: boolean;
  zipProps: ZipProps;
}

export class ZipProps {
  zippedFileName: string;
  files: ZipPropsFile[]
};

export class ZipPropsFile {
  fileName: string;
  key: string;

  /** Defines if a file is located in the temporary bucket or in the persisted bucket */
  temporary: boolean;
}