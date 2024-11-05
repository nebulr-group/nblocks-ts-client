import { Entity } from '../../../abstracts/generic-entity';
import { CreateUserRequestDto } from './models/create-user-request.dto';
import { TenantUserResponseDto } from './models/tenant-user-response.dto';

/**
 * A generic `TenantUser` client for a particular `Tenant`.
 * Use this to create or list users for this tenant
 */
export class Users extends Entity {

  constructor (parentEntity: Entity, debug:boolean) {
    super(parentEntity, debug);
  }

  /**
   * This will create a new user for a tenant resulting in a `TenantUser`
   * @param args `CreateUserRequestDto`
   * @returns `TenantUserResponseDto`
   */
  async create(data: CreateUserRequestDto): Promise<TenantUserResponseDto> {
    return (await this.getHttpClient().post<TenantUserResponseDto>('/tenant/user', data, { headers: this.getHeaders() })).data
  }

  /**
   * List all users in this tenant.
   * @returns List of `TenantUserResponseDto`
   */
  async list(): Promise<TenantUserResponseDto[]> {
    return (await this.getHttpClient().get<TenantUserResponseDto[]>('/tenant/user', { headers: this.getHeaders() })).data;
  }
}
