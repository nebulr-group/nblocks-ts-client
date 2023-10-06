import { SpecificEntity } from '../../abstracts/specific-entity';
import { FileClient } from '../file/file';
import { PdfServiceClient } from '../pdf/pdf';
import { Users } from './user/users';
import { User } from './user/user';
import { Entity } from '../../abstracts/generic-entity';
import { TenantResponseDto } from './models/tenant.model';
import { CustomerPortalResponseDto } from './models/customer-portal-response.dto';
import { TranslateTextRequest } from './models/translate-text-request';
import { TranslateTextResponse } from './models/translate-text-response';
import { UpdateTenantRequestDto } from './models/update-tenant-request.dto';
import { AuthTenantResponseDto } from '../auth/models/auth-tenant-response.dto';
import { CommunicationClient } from './communication/communication';
import { CheckoutResponsetDto } from './models/checkout-response.dto';
import { StripeTenantCheckoutIdRequestDto } from './models/stripe-tenant-checkout-id-request.dto';
import { TenantPaymentDetails } from './models/tenant-payment-details';
import { SetTenantPlanDetails } from './models/set-tenant-plan-details';

/**
 * A specific `Tenant` client for a particular Tenant id. 
 * Use this client to query or mutate data for a particular tenant
 */
export class Tenant extends SpecificEntity{

  readonly users: Users;
  readonly fileClient: FileClient;
  readonly pdfServiceClient: PdfServiceClient;
  readonly communicationClient: CommunicationClient;

  constructor (parentEntity: Entity, id:string, debug = false) {
    super(id, parentEntity, debug);

    this.users = new Users(this, this.debug);
    this.fileClient = new FileClient(this, this.debug);
    this.pdfServiceClient = new PdfServiceClient(this, this.debug);
    this.communicationClient = new CommunicationClient(this, this.debug);
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
    const response = await this.getHttpClient().get<TenantResponseDto>(`/tenant/byId/${this.id}`, { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Get a lighter tenant model than `get()` that conforms to `AuthTenantResponseDto` in `AuthTenantUserResponseDto`.
   * @returns 
   */
  async getLight(): Promise<AuthTenantResponseDto> {
    const {id, name, locale, onboarded} = (await this.getHttpClient().get<TenantResponseDto>(`/tenant/byId/${this.id}`, { headers: this.getHeaders() })).data;
    return {id, name, locale, onboarded};
  }

  /**
   * Update this tenant using the tenant model recieved using `get()`.
   * @param args `UpdateTenantRequestDto`
   * @returns `TenantResponseDto`
   */
  async update(args: UpdateTenantRequestDto): Promise<TenantResponseDto> {
    const response = await this.getHttpClient().put<TenantResponseDto>(`/tenant/${this.id}`, args, { headers: this.getHeaders() });
    return response.data;
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
    const response = await this.getHttpClient().post<TranslateTextResponse>(`/tenant/translate/text`, args, { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Creates a Stripe checkout session and returns the id from which you can render using the Stripe SDK.
   * @param args 
   * @returns 
   */
  async getPaymentDetails(): Promise<TenantPaymentDetails> {
    const response = await this.getHttpClient().get<TenantPaymentDetails>(`/tenant/${this.id}/paymentDetails`, { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Sets or changes the current plan the tenant is subscribing to. Might affect changed billing.
   * @param args 
   * @returns 
   */
  async setPlanDetails(args: SetTenantPlanDetails): Promise<TenantPaymentDetails> {
    const response = await this.getHttpClient().post<TenantPaymentDetails>(`/tenant/${this.id}/planDetails`, args, { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Creates a Stripe checkout session for an existing tenant and returns the id from which you can render using the Stripe SDK.
   * @param args 
   * @returns 
   */
  async createStripeCheckoutSession(): Promise<CheckoutResponsetDto> {
    const response = await this.getHttpClient().post<CheckoutResponsetDto>(`/tenant/${this.id}/checkoutId`, { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Obtain a url to redirect or present the user a portal for updating payment or subscription data.
   * Can be both Stripe or Azure Markeplace
   */
  async getSubscriptionPortalUrl(): Promise<CustomerPortalResponseDto> {
    const response = await this.getHttpClient().get<CustomerPortalResponseDto>(`/tenant/${this.id}/customerPortal`, { headers: this.getHeaders() });
    return response.data;
  }
}