export class UpdateTenantRequestDto {
    name?: string;
  
    /** The default locale / lang code for all users in this tenant (`ISO_639-1` format). This property will set the i18n for all platform emails and can be used to  */
    locale?: string;
  
    /** A url to a logo */
    logo?: string;

    /** The plan. Updates might have side effects to billing */
    plan?: string;  

    /** Require users to login with MFA/2FA */
    mfa?: boolean;
  
    /** Store metadata for your own business logic that will be returned in every Tenant response. This data will never be outputted to the end user */
    metadata?: Record<string, string>;
}