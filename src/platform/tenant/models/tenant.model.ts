import { TenantPaymentStatus } from "./tenant-payment-status";

/**
 * A tenant represents the account or workspace of a customer and encapsulate users for that workspace. A new tenant always creates an `OWNER` user that should be granted to change name, locale and manage the subscription (if using payment service).
 */
export class TenantResponseDto {

  /** Logical id reference to this instance */
  id: string;

  /** Name of the subscription plan. (Read only)
   * Use `setPlanDetails` to change it
   * Automatically set by the payment service if tenant used the checkout process */
  plan?: string;

  /** MFA enabled */
  mfa: boolean;

  /** Payment status */
  paymentStatus: TenantPaymentStatus;

  /** Tenant is trialing (Read only) */
  trial: boolean;

  /** The default locale / lang code for all users in this tenant (`ISO_639-1` format). 
   * This property will set the i18n for all platform emails and can be used to 
  */
  locale: string;

  /** Name of the tenant. Undefined from the begining until the Tenant owner complets tenant onboarding. */
  name?: string;

  /** Url to a public accessible logo */
  logo?: string;

  /** Store app specific meta data for this tenant */
  metadata: Record<string, string>;

  /** If this tenant is considered onboarded */
  onboarded: boolean;

  /** Logins are made with this enterprise login connection id */
  federationConnection?: string;

  /** Who signed up this tenant / Initial OWNER */
  signupBy?: { email?: string, firstName?: string; lastName?: string };

  /** Timestamp when created */
  createdAt: Date;
}