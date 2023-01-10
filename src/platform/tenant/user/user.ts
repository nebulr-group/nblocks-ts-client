import { Entity } from '../../../abstracts/generic-entity';
import { SpecificEntity } from '../../../abstracts/specific-entity';
import { EmailUserRequestDto } from './models/email-user-request.dto';
import { SendOtpSmsResponseDto } from './models/send-otp-sms-response.dto';
import { SmsUserRequestDto } from './models/sms-user-request.dto';
import { TenantUserResponseDto } from './models/tenant-user-response.dto';
import { UpdateUserRequestDto } from './models/update-user-request.dto';

/**
 * A specific `TenantUser` client for a particular tenant user id. 
 * Use this client to query or mutate data for this particular user
 */
export class User extends SpecificEntity{

  //TODO swap params order
  constructor (parentEntity: Entity, id: string, debug = false) {
    super(id, parentEntity, debug);
  }

  /**
   * Gets the user model for this user
   * @returns 
   */
  async get(): Promise<TenantUserResponseDto> {
    return (await this.getHttpClient().get<TenantUserResponseDto>(`/tenant/user/${this.id}`, { headers: this.getHeaders() })).data
  }

  /**
   * Update the user. You can change role, teams and also enable or disable the user from logging in.
   * @param args `UpdateUserRequestDto`
   * @returns `TenantUserResponseDto`
   */
  async update(args: Partial<UpdateUserRequestDto>): Promise<TenantUserResponseDto> {
    return (await this.getHttpClient().put<TenantUserResponseDto>(`/tenant/user/${this.id}`, args, { headers: this.getHeaders() })).data
  }

  /**
   * Delete the user. This will prevent the user from loggin in.
   */
  async delete(): Promise<void> {
    await this.getHttpClient().delete(`/tenant/user/${this.id}`, { headers: this.getHeaders() })
  }

  /**
   * Send the user an email
   * @param args `EmailUserRequestDto`
   */
  async sendEmail(args: EmailUserRequestDto): Promise<void> {
    await this.getHttpClient().post(`/tenant/user/${this.id}/email`, args, { headers: this.getHeaders() });
  }

  /**
   * Initiates the reset password process for this user. Will send an email to user with a link to set a new password. The link will be constructed using {appUrl}/auth/set-password/XXXX.
   * 
   * Similar to `Auth.forgotPassword()`.
   */
  async resetPassword(): Promise<void> {
    await this.getHttpClient().post(`/tenant/user/${this.id}/password`, {}, { headers: this.getHeaders() });
  }

  /**
   * Send the user a SMS
   * @param args `SmsUserRequestDto`
   */
  async sendSms(args: SmsUserRequestDto): Promise<void> {
    await this.getHttpClient().post(`/tenant/user/${this.id}/sms`, args, { headers: this.getHeaders() });
  }

  /**
   * Send an SMS to the user containing an OTP (One Time Password).
   * @returns `SendOtpSmsResponseDto` containing the generated OTP
   */
  async sendOtpSms(): Promise<SendOtpSmsResponseDto> {
    return (await this.getHttpClient().post<SendOtpSmsResponseDto>(`/tenant/user/${this.id}/smsOtp`, {}, { headers: this.getHeaders() })).data
  }
}

