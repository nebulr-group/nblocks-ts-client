import { Entity } from '../../abstracts/generic-entity';
import { NblocksClient } from '../nblocks-client';
import { CheckoutResponsetDto } from './models/checkout-response.dto';
import { CreateTenantRequestDto } from './models/create-tenant-request.dto';
import { ImportStatusResponse } from './models/import-status.response';
import { ImportTenantFromFileRequest } from './models/import-tenant-from-file.request';
import { ImportTenantScheduledResponse } from './models/import-tenant-scheduled.response';
import { StripeTenantCheckoutIdRequestDto } from './models/stripe-tenant-checkout-id-request.dto';
import { TenantResponseDto } from './models/tenant.model';
import { ValidateImportTenantResult } from './models/validate-import-tenant.response';

/**
 * A generic Tenants client. 
 * Use this to create or list tenants
 */
export class Tenants extends Entity {
  
  constructor (parentEntity: NblocksClient, debug:boolean) {
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

  /**
   * Creates a Stripe checkout session (for a non existing tenant) and returns the id from which you can render using the Stripe SDK.
   * @param args 
   * @returns 
   */
  async createStripeCheckoutSession(args: StripeTenantCheckoutIdRequestDto): Promise<CheckoutResponsetDto> {
    const response = await this.getHttpClient().post<CheckoutResponsetDto>(`/app/checkoutId`, args, { headers: this.getHeaders() });
    return response.data;
  }

  async validateImportFromFile(importData: ImportTenantFromFileRequest): Promise<ValidateImportTenantResult> {
    const response = await this.getHttpClient().post<ValidateImportTenantResult>(`/import/validateTenantsFromFile`, importData, { headers: this.getHeaders() });
    return response.data;
  }

  async importFromFile(importData: ImportTenantFromFileRequest): Promise<ImportTenantScheduledResponse> {
    const response = await this.getHttpClient().post<ImportTenantScheduledResponse>(`/import/tenantsFromFile`, importData, { headers: this.getHeaders() });
    return response.data;
  }

  async checkImportStatus(reference: string): Promise<ImportStatusResponse> {
    const response = await this.getHttpClient().get<ImportStatusResponse>(`/import/status/${reference}`, { headers: this.getHeaders() });
    return response.data;
  }
}