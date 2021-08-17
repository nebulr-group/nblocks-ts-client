import { Entity } from '../../abstracts/generic-entity';
import { AuthTenantUserResponseDto } from './models/auth-tenant-user-response.dto';
import { AuthenticateRequestDto } from './models/authenticate-request.dto';
import { AuthenticateResponseDto } from './models/authenticate-response.dto';
import { AuthenticatedResponse } from './models/authenticated-response';
import { AuthorizeResponseDto } from './models/authorize-response.dto';
import { DeauthenticateResponse } from './models/deauthenticated-response';
import { UpdatePasswordRequestDto } from './models/update-password-request.dto';
import { UpdateUserInfoRequestDto } from './models/update-user-info-request.dto';

/**
 * This client operates on the User entity from an Auth context.
 * For managing or creating Users, see `UserClient` and `UsersClient` 
 */
export class Auth extends Entity{

  constructor (parentEntity: Entity, debug = false) {
    super(parentEntity, debug);
  }

  /** Authenticates a user */
  async authenticate(credentials: AuthenticateRequestDto, userAgent: string): Promise<AuthenticateResponseDto> {
    return (await this.parentEntity.getHttpClient().post<AuthenticateResponseDto>('/auth/authenticate', credentials, {headers: {...this.getHeaders(), 'User-Agent': userAgent}})).data;
  }

  async authenticated(token: string): Promise<AuthenticatedResponse> {
    return (await this.parentEntity.getHttpClient().post<AuthenticatedResponse>('/auth/authenticated', {authToken: token}, {headers: this.getHeaders()})).data;
  }

  async deauthenticate(token: string): Promise<DeauthenticateResponse> {
    return (await this.parentEntity.getHttpClient().post<DeauthenticateResponse>('/auth/deauthenticate', {authToken: token}, {headers: this.getHeaders()})).data;
  }

  /**
   * Lists all tenant users (e.g. user profiles) this user can identify as to become fully authenticated
   * @param token 
   */
  async listMyTenantUsers(token: string): Promise<AuthTenantUserResponseDto[]> {
    return (await this.parentEntity.getHttpClient().post<AuthTenantUserResponseDto[]>('/auth/listMyTenantUsers', {authToken: token}, {headers: this.getHeaders()})).data;
  }

  // This method essentially does exactly what `User.resetPassword()` does but takes username as parameter
  async forgotPassword(username: string): Promise<void> {
    throw new Error("Not implemented yet");
  }

  async updatePassword(args: UpdatePasswordRequestDto): Promise<void> {
    await this.parentEntity.getHttpClient().put<AuthTenantUserResponseDto[]>('/auth/password', args, {headers: this.getHeaders()});
  }

  async updateMe(profile: UpdateUserInfoRequestDto): Promise<void> {
    await this.parentEntity.getHttpClient().put('/auth/user', profile, {headers: this.getHeaders()});
  }

  /**
   * Authorizes a user for a given privilege. Responses are cached up to 1 min (not yet)
   * @param token 
   * @param tenantUserId 
   * @param privilege 
   * @returns 
   */
  async authorize(token: string, tenantUserId: string, privilege: string): Promise<AuthorizeResponseDto> {
    return (await this.parentEntity.getHttpClient().post<AuthorizeResponseDto>('/auth/authorize', {authToken: token, tenantUserId, privilege}, {headers: this.getHeaders()})).data;
  }
}