import { Entity } from '../../abstracts/generic-entity';
import { CreateTenantRequestDto } from './models/create-tenant-request.dto';
import { TenantResponseDto } from './models/tenant.model';

/**
 * A generic Tenants client. 
 * Use this to create or list tenants
 */
export class Tenants extends Entity {
  
  constructor (parentEntity: Entity, debug:boolean) {
    super(parentEntity, debug);
  }

  /**
   * This will create a new tenant manually without billing capabilities.
   * Use `tenant.createStripeCheckoutSession()` to ensure the tenant has billing and payments setup
   * @param args `CreateTenantRequestDto`
   * @returns `TenantResponseDto`
   */
  async create(args: CreateTenantRequestDto): Promise<TenantResponseDto> {
    return (await this.getHttpClient().post<TenantResponseDto>(`/tenant`, args, { headers: this.getHeaders() })).data;
  }

  /**
   * List all tenants in your app
   * @returns a list of `TenantResponseDto`
   */
  async list(): Promise<TenantResponseDto[]> {
    return (await this.getHttpClient().get<TenantResponseDto[]>(`/tenant`, { headers: this.getHeaders() })).data;
  }
}