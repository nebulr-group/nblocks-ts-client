import { JWTPayload } from 'jose/dist/types/types';

export interface Profile {
    id: string;
    username?: string;
    email?: string;
    emailVerified?: boolean;
    givenName?: string;
    familyName?: string;
    fullName?: string;
    locale?: string;
    onboarded?: boolean;
    multiTenantAccess?: boolean;
    tenant?: {
      id?: string;
      name?: string;
      locale?: string;
      logo?: string;
      onboarded?: boolean;
    }
  }
  
export interface IDToken extends JWTPayload {
    sub: string;
    preferred_username?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    onboarded?: boolean;
    tenant_id?: string;
    tenant_name?: string;
    tenant_locale?: string;
    tenant_logo?: string;
    tenant_onboarded?: boolean;
    multi_tenant?: boolean;
  }