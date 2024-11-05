export class CreateResponseDto {
    /** Key of the PDF file generated and uploaded. File will be available for 24h. Use this key with `fileClient.persistUploadedFile` if you wish to persist the file */
    key: string;

    /** Access the file immediately with this secure url */
    signedUrl: String;
}