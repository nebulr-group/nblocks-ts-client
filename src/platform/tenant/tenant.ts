import { SpecificEntity } from '../../abstracts/specific-entity';
import { FileClient } from '../file/file';
import { Users } from './user/users';
import { User } from './user/user';
import { Entity } from '../../abstracts/generic-entity';
import { TenantResponseDto } from './models/tenant.model';
import { CustomerPortalResponseDto } from './models/customer-portal-response.dto';
import { TranslateTextRequest } from './models/translate-text-request';
import { TranslateTextResponse } from './models/translate-text-response';
import { UpdateTenantRequestDto } from './models/update-tenant-request.dto';
import { AuthTenantResponseDto } from '../auth/models/auth-tenant-response.dto';

/**
 * A specific `Tenant` client for a particular Tenant id. 
 * Use this client to query or mutate data for a particular tenant
 */
export class Tenant extends SpecificEntity{

  readonly users: Users;
  readonly fileClient: FileClient;

  constructor (parentEntity: Entity, id:string, debug = false) {
    super(id, parentEntity, debug);

    this.users = new Users(this, this.debug);
    this.fileClient = new FileClient(this, this.debug);
  }

  /** Override */
  getHeaders(): Record<string, string> {
    return {...this.parentEntity.getHeaders(), "x-tenant-id": this.id};
  }

  /** Gets user client for a particular User id */
  user(userId: string): User {
    return new User(this, userId, this.debug);
  }

  /**
   * Get the tenant model for this tenant
   * @returns `TenantResponseDto`
   */
  async get(): Promise<TenantResponseDto> {
    return (await this.getHttpClient().get<TenantResponseDto>(`/tenant/byId/${this.id}`, { headers: this.getHeaders() })).data;
  }

  /**
   * Get a lighter tenant model than `get()` that conforms to `AuthTenantResponseDto` in `AuthTenantUserResponseDto`.
   * @returns 
   */
  async getLight(): Promise<AuthTenantResponseDto> {
    const {id,name,locale} = (await this.getHttpClient().get<TenantResponseDto>(`/tenant/byId/${this.id}`, { headers: this.getHeaders() })).data;
    return {id,name,locale};
  }

  /**
   * Update this tenant using the tenant model recieved using `get()`.
   * @param args `UpdateTenantRequestDto`
   * @returns `TenantResponseDto`
   */
  async update(args: UpdateTenantRequestDto): Promise<TenantResponseDto> {
    return (await this.getHttpClient().put<TenantResponseDto>(`/tenant/${this.id}`, args, { headers: this.getHeaders() })).data;
  }

  async delete(): Promise<void> {
    throw new Error("Not implemented yet");
  }

  /**
   * Translates any given text into the language (locale) of the tenant
   * @param args 
   * @returns 
   */
  async translateText(args: TranslateTextRequest): Promise<TranslateTextResponse> {
    return (await this.getHttpClient().post<TranslateTextResponse>(`/tenant/translate/text`, args, { headers: this.getHeaders() })).data;
  }

  /**
   * Obtain an short lived session url to redirect or present the user its Stripe subscription panel for updating payment or subscription data.
   */
  async getStripeCustomerPortalUrl(): Promise<CustomerPortalResponseDto> {
    return (await this.getHttpClient().get<CustomerPortalResponseDto>(`/tenant/customerPortal`, { headers: this.getHeaders() })).data;
  }
}