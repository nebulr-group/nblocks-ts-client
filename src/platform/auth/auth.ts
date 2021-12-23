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

  /**
   * Authenticates a user by creating a new session. 
   * Returns a session token to be used in all user<->app interactions. No app or tenant context required.
   * @param credentials User provided credentials
   * @param userAgent The user agent header
   * @returns `AuthenticateResponseDto` including the session token
   */
  async authenticate(credentials: AuthenticateRequestDto, userAgent: string): Promise<AuthenticateResponseDto> {
    return (await this.parentEntity.getHttpClient().post<AuthenticateResponseDto>('/auth/authenticate', credentials, {headers: {...this.getHeaders(), 'User-Agent': userAgent}})).data;
  }

  /**
   * Check if a user session token is valid.
   * @param token The user token
   * @returns `AuthenticatedResponse` containing a boolean result
   */
  async authenticated(token: string): Promise<AuthenticatedResponse> {
    return (await this.parentEntity.getHttpClient().post<AuthenticatedResponse>('/auth/authenticated', {authToken: token}, {headers: this.getHeaders()})).data;
  }

  /**
   * Destroys the session and all auth contexts stored in that session.
   * @param token The user token
   * @returns `DeauthenticateResponse`
   */
  async deauthenticate(token: string): Promise<DeauthenticateResponse> {
    return (await this.parentEntity.getHttpClient().post<DeauthenticateResponse>('/auth/deauthenticate', {authToken: token}, {headers: this.getHeaders()})).data;
  }

  /**
   * @deprecated Use `listTenantUsers` instead
   */
  async listMyTenantUsers(token: string): Promise<AuthTenantUserResponseDto[]> {
    return this.listTenantUsers(token);
  }

  /**
   * Lists all tenant users (e.g. user profiles) this user can identify as to become fully authenticated.
   *
   * For a user to successfully make calls to apps where the app needs to authorise this user for a required privilege before continuing, the user must also provide the tenant user context.
   * TenantUsers binds a user with a session token to a specific tenant within an app. All user calls to apps needs to have the context of a tenant. Use this endpoint to present the user to the available identies to take for this app.
   * 
   * @param token The user auth token
   * @returns A list of `AuthTenantUserResponseDto`
   */
  async listTenantUsers(token: string): Promise<AuthTenantUserResponseDto[]> {
    return (await this.parentEntity.getHttpClient().post<AuthTenantUserResponseDto[]>('/auth/listMyTenantUsers', {authToken: token}, {headers: this.getHeaders()})).data;
  }

  /**
   * Initiates the reset password process. Will send an email to user with a link to set a new password. The link will be constructed using {appUrl}/auth/set-password/XXXX.
   * See `updatePassword()` for how to update the password.
   * 
   * Similar to `User.resetPassword()`.
   * @param username Same as email
   */
  async forgotPassword(username: string): Promise<void> {
    await this.parentEntity.getHttpClient().post('/auth/password', {username}, {headers: this.getHeaders()});
  }

  /**
   * Update users password with a new one. You must provide a valid reset token that the user has received from a forgot password email.
   * @param args `UpdatePasswordRequestDto` containing the new password and a valid reset token
   */
  async updatePassword(args: UpdatePasswordRequestDto): Promise<void> {
    await this.parentEntity.getHttpClient().put<AuthTenantUserResponseDto[]>('/auth/password', args, {headers: this.getHeaders()});
  }

  /**
   * @deprecated Use `updateUser` instead.
   */
  async updateMe(profile: UpdateUserInfoRequestDto): Promise<void> {
    await this.updateUser(profile);
  }

  /**
   * Updates users name and contact information. Should be a part of the user onboarding.
   * @param profile `UpdateUserInfoRequestDto`
   */
  async updateUser(profile: UpdateUserInfoRequestDto): Promise<void> {
    await this.parentEntity.getHttpClient().put('/auth/user', profile, {headers: this.getHeaders()});
  }

  /**
   * Authorizes a user for a given privilege. Responses are cached up to 1 min (not yet)
   * 
   * Authorizes a user for a given privilege. This is a central endpoint for your app to use and authorize a user for specific action. User must have selected TenantUser id. Endpoint returns current tenant id and other useful information that can be used to allow further propagation in app.
   * The configured app roles and privileges plays a central role in the authorizing process.
   * @param token User auth token
   * @param tenantUserId The selected tenant user id (retrieved from `listTenantUsers`)
   * @param privilege The requested role privilege to grant
   * @returns `AuthorizeResponseDto` containing both a user instance and if the user is granted the action or not
   */
  async authorize(token: string, tenantUserId: string, privilege: string): Promise<AuthorizeResponseDto> {
    return (await this.parentEntity.getHttpClient().post<AuthorizeResponseDto>('/auth/authorize', {authToken: token, tenantUserId, privilege}, {headers: this.getHeaders()})).data;
  }
}