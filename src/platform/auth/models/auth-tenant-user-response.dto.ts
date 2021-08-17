import { AuthTenantResponseDto } from "./auth-tenant-response.dto";

/**
 * A lightweight version of TenantUserModel
 */
export class AuthTenantUserResponseDto {
  id!: string;
  role!: string;
  email!: string;
  username!: string;
  fullName?: string;

  onboarded!: boolean;

  tenant: AuthTenantResponseDto
}