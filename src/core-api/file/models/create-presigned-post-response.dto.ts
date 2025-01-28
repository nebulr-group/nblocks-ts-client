export class CreatePresignedPostResponseDto {
    /** Upload to this url */
    url: string;
  
    /** Attach these headers to the upload call. Keep order of headers */
    fields: Record<string, string>;
  }