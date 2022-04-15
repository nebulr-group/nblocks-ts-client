import { Client } from '../../../abstracts/client';
import { PlatformClient } from '../../platform-client';
import { Tenant } from '../tenant';
import { SendOtpSmsResponseDto } from '../user/models/send-otp-sms-response.dto';
import { User } from '../user/user';
import { RedirectRuleDto } from './models/redirect-rule.dto';
import { SendEmailRequestDto } from './models/send-email-request.dto';

export class CommunicationClient extends Client {

  private readonly BASE_URLS = {
    'PROD':'https://communication-api.nebulr-core.com',
    'STAGE':'https://communication-api-stage.nebulr-core.com',
    'DEV':'http://communication-api:3000'
  };

  constructor (parentEntity: Tenant, debug = false) {
    super(parentEntity, debug);
  }

  /**
   * Lists current voice redirect rules stored for this tenant
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

  // Reenable the below actions as soon as communication-api email/sms controller is ready for app callers
  /**
   * Send an email to anyone.
   * @param args 
   */
  // async sendEmail(args: SendEmailRequestDto): Promise<void> {
  //   await this.getHttpClient().post<string>(`email/send`, args, { headers: this.getHeaders()});
  // }

  /**
   * Send an SMS to anyone
   * @param args 
   */
  // async sendSms(args: { to: string, text: string }): Promise<void> {
  //   await this.getHttpClient().post<string>(`communication/sms`, args, { headers: this.getHeaders()});
  // }

  /**
   * Send an SMS to anyone containing an OTP (One Time Password).
   * @param args 
   * @returns `SendOtpSmsResponseDto` containing the generated OTP
   */
  // async sendOtpSms(args: { to: string, locale: 'en' | 'sv' | string }): Promise<SendOtpSmsResponseDto> {
  //   return (await this.getHttpClient().post<SendOtpSmsResponseDto>(`communication/smsOtp`, args, { headers: this.getHeaders()})).data;
  // }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns 
   */
  //  private _getBaseUrl(): string {
  //   return this.BASE_URLS[this.getPlatformClient().stage];
  // }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns 
   */
   private _getBaseUrl(): string {
    return this.BASE_URLS[this.getPlatformClient().stage];
  }
}