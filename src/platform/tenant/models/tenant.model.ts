/**
 * A tenant represents the account or workspace of a customer and encapsulate users for that workspace. A new tenant always creates an `OWNER` user that should be granted to change name, locale and manage the subscription (if using payment service).
 */
 export class TenantResponseDto {

   /** Logical id reference to this instance */
   id: string;

   /** Name of the subscription plan. Automatically set by the payment service if tenant used the checkout process */
   plan?: string;

   /** The default locale / lang code for all users in this tenant (`ISO_639-1` format). 
   * This property will set the i18n for all platform emails and can be used to 
   */
   locale: string;

   /** Name of the tenant. Undefined from the begining until the Tenant owner complets tenant onboarding. */
   name?: string;

   /** Url to a public accessible logo */
   logo?: string;

   /** Require users to login with MFA/2FA */
   mfa: boolean;

  /** Payment method is set up. We can bill this workspace */
   paymentsEnabled: boolean;

  /** The tenant should setup payment immediately because tenant has not setup payments and the subscribing plan carry a cost and the trial has ended */
   paymentsRequired: boolean;

   /** Store app specific meta data for this tenant */
   metadata?: Record<string, string>;

   /** If this tenant is considered onboarded (Read only) */
   onboarded: boolean;

   /** Timestamp when created */
   createdAt: Date;
 }