import { TemplateName } from "./template-name.type";

export class UpdateEmailTemplateRequestDto {
  type: TemplateName;
  content: string;
}
