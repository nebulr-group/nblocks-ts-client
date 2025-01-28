export class CreateZipRequestDto {
  tenantId: string;
  zipProps: ZipProps;
}

export class ZipProps {
  zippedFileName: string;
  files: ZipPropsFile[]
};

/**
 * Defines where the source file (which will be appended to the zip file) is located
 */
export class ZipPropsFile {
  fileName: string;
  key: string;

  /** Defines if a file is located in the upload (temp) bucket or in the persistent bucket */
  temporary: boolean;
}