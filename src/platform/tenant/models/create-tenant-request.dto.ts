export class CreateTenantRequestDto {
    /** The plan must be present in the configured App business model */
    plan: string;
  
    /** A user will need to be assigned as an owner to this tenant. Either reused if the user already exist or a new user will be created. The user will be onboarded automatically */
    email: string;
    
    /** Name of the tenant. Can also be set by tenant owner during onboarding */
    name?: string;
    
    /** A url to a logo. Can also be set by tenant owner during onboarding */
    logo?: string;
    
    /** Store metadata for your own business logic that will be returned in every Tenant response. This data will never be outputted to the end user */
    metadata?: Record<string, string>;
}