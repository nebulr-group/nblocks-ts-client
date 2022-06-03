import { AuthTenantResponseDto } from "./auth-tenant-response.dto";

/**
 * A lightweight version of TenantUserResponseDto. See TenantUserResponseDto for more type information
 */
export class AuthTenantUserResponseDto {
  id!: string;
  role!: string;
  email!: string;
  username!: string;
  fullName?: string;

  onboarded!: boolean;
  consentsToPrivacyPolicy: boolean;

  tenant: AuthTenantResponseDto
}