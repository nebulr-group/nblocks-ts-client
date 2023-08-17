import { Entity } from '../../abstracts/generic-entity';
import { CreateTenantRequestDto } from './models/create-tenant-request.dto';
import { ImportTenantFromFileRequest } from './models/import-tenant-from-file.request';
import { ImportTenantScheduledResponse } from './models/import-tenant-scheduled.response';
import { TenantResponseDto } from './models/tenant.model';
import { ValidateImportTenantResult } from './models/validate-import-tenant.response';

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

  async validateImportFromFile(importData: ImportTenantFromFileRequest): Promise<ValidateImportTenantResult> {
    const response = await this.getHttpClient().post<ValidateImportTenantResult>(`/import/validateTenantsFromFile`, importData, { headers: this.getHeaders() });
    return response.data;
  }

  async importFromFile(importData: ImportTenantFromFileRequest): Promise<ImportTenantScheduledResponse> {
    const response = await this.getHttpClient().post<ImportTenantScheduledResponse>(`/import/tenantsFromFile`, importData, { headers: this.getHeaders() });
    return response.data;
  }
}