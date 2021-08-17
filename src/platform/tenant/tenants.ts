import { Entity } from '../../abstracts/generic-entity';
import { CreateTenantRequestDto } from './models/create-tenant-request.dto';
import { TenantResponseDto } from './models/tenant.model';

export class Tenants extends Entity {
  
  constructor (parentEntity: Entity, debug:boolean) {
    super(parentEntity, debug);
  }

  /**
   * This will create a new tenant manually without billing capabilities.
   * A better approach is to let new customers checkout themselves with `PlatformClient.createCheckoutSession()` and spawn as new tenants in your app automatically.
   * @param args 
   * @returns 
   */
  async create(args: CreateTenantRequestDto): Promise<TenantResponseDto> {
    return (await this.getHttpClient().post<TenantResponseDto>(`/tenant`, args, { headers: this.getHeaders() })).data;
  }

  async list(): Promise<TenantResponseDto[]> {
    return (await this.getHttpClient().get<TenantResponseDto[]>(`/tenant`, { headers: this.getHeaders() })).data;
  }
}