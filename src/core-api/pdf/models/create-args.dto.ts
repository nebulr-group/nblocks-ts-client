export class CreateArgsDto {
  /** Url to either web page or Html file location */
  url: string;

  /** Name of the PDF file that will be generated */
  fileName: string;
}