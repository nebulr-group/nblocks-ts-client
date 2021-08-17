export class SendEmailRequestDto {
    to!: string;
    emailTitle!: string;
    emailBody!: string;
    ctaUrl?: string;
    ctaTitle?: string;
  }