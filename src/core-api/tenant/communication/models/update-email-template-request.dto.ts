import { TemplateName } from "./template-name.type";

export class UpdateEmailTemplateRequestDto {
  /** The template to update */
  type: TemplateName;

  /** The template HTML content. Supports variables */
  content: string;

  /** Send a test email to this recipient containing the template */
  testRecipient?: string;
}
