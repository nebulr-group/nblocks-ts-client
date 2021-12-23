import { Client } from '../../abstracts/client';
import { PlatformClient } from '../platform-client';
import { SendOtpSmsResponseDto } from '../tenant/user/models/send-otp-sms-response.dto';
import { User } from '../tenant/user/user';
import { SendEmailRequestDto } from './models/send-email-request.dto';

// TODO migrate this client to call communication api directly
// TODO Generic client?
export class CommunicationClient extends Client {

  // private readonly BASE_URLS = {
  //   'PROD':'https://communication-api.nebulr-core.com',
  //   'STAGE':'https://communication-api-stage.nebulr-core.com',
  //   'DEV':'http://localhost:3020'
  // };

  constructor (parentEntity: User | PlatformClient, debug = false) {
    super(parentEntity, debug);
  }

  /**
   * Send an email to anyone.
   * @param args 
   */
  async sendEmail(args: SendEmailRequestDto): Promise<void> {
    await this.getHttpClient().post<string>(`communication/email`, args, { headers: this.getHeaders()});
  }

  /**
   * Send an SMS to anyone
   * @param args 
   */
  async sendSms(args: { to: string, text: string }): Promise<void> {
    await this.getHttpClient().post<string>(`communication/sms`, args, { headers: this.getHeaders()});
  }

  /**
   * Send an SMS to anyone containing an OTP (One Time Password).
   * @param args 
   * @returns `SendOtpSmsResponseDto` containing the generated OTP
   */
  async sendOtpSms(args: { to: string, locale: 'en' | 'sv' | string }): Promise<SendOtpSmsResponseDto> {
    return (await this.getHttpClient().post<SendOtpSmsResponseDto>(`communication/smsOtp`, args, { headers: this.getHeaders()})).data;
  }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns 
   */
  //  private _getBaseUrl(): string {
  //   return this.BASE_URLS[this.getPlatformClient().stage];
  // }
}