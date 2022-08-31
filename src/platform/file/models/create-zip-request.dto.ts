export class CreateZipRequestDto {
  tenantId: string;
  publicFile: boolean;
  zipProps: ZipProps;
}

export class ZipProps {
  zippedFileKey: string;
  files: ZipPropsFile[]
};

export class ZipPropsFile {
  fileName: string;
  key: string;
}