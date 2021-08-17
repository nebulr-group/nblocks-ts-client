import { Entity } from '../../../abstracts/generic-entity';
import { SpecificEntity } from '../../../abstracts/specific-entity';
import { EmailUserRequestDto } from './models/email-user-request.dto';
import { SendOtpSmsResponseDto } from './models/send-otp-sms-response.dto';
import { SmsUserRequestDto } from './models/sms-user-request.dto';
import { TenantUserResponseDto } from './models/tenant-user-response.dto';
import { UpdateUserRequestDto } from './models/update-user-request.dto';

export class User extends SpecificEntity{

  //TODO swap params order
  constructor (parentEntity: Entity, id: string, debug = false) {
    super(id, parentEntity, debug);
  }

  /** Not implemented yet, see `Users.list()` or `Auth.authorize()` */
  async get(): Promise<TenantUserResponseDto> {
    throw new Error("Not implemented yet");
  }

  async update(args: Partial<UpdateUserRequestDto>): Promise<TenantUserResponseDto> {
    return (await this.getHttpClient().put<TenantUserResponseDto>(`/tenant/user/${this.id}`, args, { headers: this.getHeaders() })).data
  }

  async delete(): Promise<void> {
    await this.getHttpClient().delete(`/tenant/user/${this.id}`, { headers: this.getHeaders() })
  }

  async sendEmail(args: EmailUserRequestDto): Promise<void> {
    await this.getHttpClient().post(`/tenant/user/${this.id}/email`, args, { headers: this.getHeaders() });
  }

  async resetPassword(): Promise<void> {
    await this.getHttpClient().post(`/tenant/user/${this.id}/password`, {}, { headers: this.getHeaders() });
  }

  async sendSms(args: SmsUserRequestDto): Promise<void> {
    await this.getHttpClient().post(`/tenant/user/${this.id}/sms`, args, { headers: this.getHeaders() });
  }

  async sendOtpSms(): Promise<SendOtpSmsResponseDto> {
    return (await this.getHttpClient().post<SendOtpSmsResponseDto>(`/tenant/user/${this.id}/smsOtp`, {}, { headers: this.getHeaders() })).data
  }
}

