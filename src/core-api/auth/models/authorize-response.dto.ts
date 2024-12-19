import { AuthTenantUserResponseDto } from "./auth-tenant-user-response.dto";

export class AuthorizeResponseDto {
  /** Wheather the user is granted to perform the action */
  granted: boolean;
  
  /** A resolved light weight user instance */
  user: AuthTenantUserResponseDto;
}