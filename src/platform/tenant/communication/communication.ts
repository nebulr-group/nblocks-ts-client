import { Client } from '../../../abstracts/client';
import { ConfigHelper } from '../../../shared/config';
import { NblocksClient } from '../../nblocks-client';
import { Tenant } from '../tenant';
import { EmailTemplateResponseDto } from './models/get-email-template-response.dto';
import { RedirectErrorEventDto } from './models/redirect-error-event.dto';
import { RedirectRuleDto } from './models/redirect-rule.dto';
import { SendEmailRequestDto } from './models/send-email-request.dto';
import { TemplateName } from './models/template-name.type';
import { UpdateEmailTemplateRequestDto } from './models/update-email-template-request.dto';

export class CommunicationClient extends Client {

  private readonly BASE_URLS = {
    'PROD': 'https://communication-api.nebulr-core.com',
    'STAGE': 'https://communication-api-stage.nebulr-core.com',
    'DEV': 'http://communication-api:3000'
  };

  constructor(parentEntity: Tenant | NblocksClient, debug = false) {
    super(parentEntity, debug);
    this._log(`Initialized CommunicationClient with url: ${this._getBaseUrl()}`);
  }

  /**
   * Lists current voice redirect rules stored for this tenant.
   * @returns RedirectRuleDto[]
   */
  async listVoiceRedirectRules(): Promise<RedirectRuleDto[]>{
    const rules = (await this.getHttpClient().get<RedirectRuleDto[]>(`voice/redirectRule`, { headers: this.getHeaders(), baseURL: this._getBaseUrl()})).data;
    return rules;
  }

  /**
   * Creates a voice redirect rule for this tenant
   * @returns RedirectRuleDto
   */
  async createVoiceRedirectRule(args: RedirectRuleDto): Promise<RedirectRuleDto>{
    const rule = (await this.getHttpClient().post<RedirectRuleDto>(`voice/redirectRule`, args, { headers: this.getHeaders(), baseURL: this._getBaseUrl()})).data;
    return rule;
  }

  /**
   * Creates a voice redirect rule for this tenant
   * @returns RedirectRuleDto
   */
  async updateVoiceRedirectRule(args: RedirectRuleDto): Promise<RedirectRuleDto>{
    const rule = (await this.getHttpClient().put<RedirectRuleDto>(`voice/redirectRule`, args, { headers: this.getHeaders(), baseURL: this._getBaseUrl()})).data;
    return rule;
  }

  /**
   * Delete a voice redirect rule
   * @returns RedirectRuleDto
   */
  async deleteVoiceRedirectRule(id: string): Promise<void>{
    await this.getHttpClient().delete<RedirectRuleDto>(`voice/redirectRule/${id}`, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
  }
  
  /**
   * List errors for this voice redirect rule
   * @returns RedirectRuleDto
   */
  async listVoiceRedirectErrors(id: string, limit = 5): Promise<RedirectErrorEventDto[]>{
    const rules = (await this.getHttpClient().get<RedirectErrorEventDto[]>(`/voice/redirectRule/errors/${id}/${limit}`, { headers: this.getHeaders(), baseURL: this._getBaseUrl()})).data;
    return rules;
  }

  /**
   * Send an email to anyone.
   * @param args 
   * @returns SendEmailResponseDto
   */
  async sendEmail(args: SendEmailRequestDto): Promise<void> {
    return (await this.getHttpClient().post<void>(`email/send`, args, { headers: this.getHeaders(), baseURL: this._getBaseUrl() })).data;
  }

  /**
   * Send an SMS to anyone
   * @param args 
   */
  // Don't implement like this, communication controller in account-api is deprecated
  // async sendSms(args: { to: string, text: string }): Promise<void> {
  //   await this.getHttpClient().post<string>(`communication/sms`, args, { headers: this.getHeaders()});
  // }

  /**
   * Send an SMS to anyone containing an OTP (One Time Password).
   * @param args 
   * @returns `SendOtpSmsResponseDto` containing the generated OTP
   */
    // Don't implement like this, communication controller in account-api is deprecated
  // async sendOtpSms(args: { to: string, locale: 'en' | 'sv' | string }): Promise<SendOtpSmsResponseDto> {
  //   return (await this.getHttpClient().post<SendOtpSmsResponseDto>(`communication/smsOtp`, args, { headers: this.getHeaders()})).data;
  // }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns 
   */
  private _getBaseUrl(): string {
    return ConfigHelper.getEnvVariable("NBLOCKS_COMMUNICATION_API_URL") || this.BASE_URLS[this.getPlatformClient().stage];
  }

  /**
   * **Internal functionality. Do not use this function**. Use `client.config.getEmailTemplate()` instead.
   * @param type TemplateName
   * @returns 
   */
  async _internalGetTemplate(type: TemplateName): Promise<EmailTemplateResponseDto> {
    if (!(this.parentEntity instanceof NblocksClient)) {
      throw new Error("Your trying to set a config on the app level. You're trying call this function in the context of a tenant. You should use client.config.getEmailTemplate() instead.");
    }
    const response = await this.getHttpClient().get<EmailTemplateResponseDto>(`/email/template/${type}`, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  /**
   * **Internal functionality. Do not use this function**. Use `client.config.overrideEmailTemplate()` instead.
   * @param args UpdateEmailTemplateRequestDto
   * @returns EmailTemplateResponseDto
   */
  async _internalOverrideTemplate(args: UpdateEmailTemplateRequestDto): Promise<EmailTemplateResponseDto> {
    if (!(this.parentEntity instanceof NblocksClient)) {
      throw new Error("Your trying to set a config on the app level. You're trying call this function in the context of a tenant. You should use client.config.overrideEmailTemplate() instead.");
    }
    const response = await this.getHttpClient().put<EmailTemplateResponseDto>(`/email/template/${args.type}`, args, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  /**
   * **Internal functionality. Do not use this function**. Use `client.config.resetEmailTemplate()` instead.
   * @param type TemplateName
   * @returns 
   */
  async _internalResetTemplate(type: TemplateName): Promise<void> {
    if (!(this.parentEntity instanceof NblocksClient)) {
      throw new Error("Your trying to set a config on the app level. You're trying call this function in the context of a tenant. You should use client.config.resetEmailTemplate() instead.");
    }
    await this.getHttpClient().delete<EmailTemplateResponseDto>(`/email/template/${type}`, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
  }
}