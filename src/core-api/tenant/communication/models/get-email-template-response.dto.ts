import { TemplateName } from "./template-name.type";

export class EmailTemplateResponseDto {
  type: TemplateName;
  content: string;
}
