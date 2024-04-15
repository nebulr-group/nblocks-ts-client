import { SpecificEntity } from '../../abstracts/specific-entity';
import { AuthContextHelper } from './auth-context-helper';
import { AuthContext } from './models/auth-context';
import { TokensResponse } from './models/tokens.response.dto';

export class OAuth extends SpecificEntity{

  private readonly BASE_URLS = {
    'PROD': 'https://auth.nblocks.cloud',
    'STAGE': 'https://auth-stage.nblocks.cloud',
    'DEV': 'http://localhost:3070'
  };

  /**
   * AuthContext helper.
   * Use this to resolve user JTWs. All JTWs are checked for integrity and security
   */
  contextHelper: AuthContextHelper;

  constructor (parentEntity: SpecificEntity, debug = false) {
    super(parentEntity.id, parentEntity, debug);
    this.contextHelper = new AuthContextHelper(parentEntity, debug);
  }

  /** Get entrypoint to the login flow. Redirect your user to this url */
  getLoginUrl(options?: {redirectUri?: string, state?: string}): string {
    const params = options ? new URLSearchParams(options) : undefined;
    return `${this._getBaseUrl()}/url/login/${this.id}${!!params ? '?' + params.toString() : ''}`;
  }

  getLogoutUrl(options?: {redirectUri?: string, state?: string}): string {
    const params = options ? new URLSearchParams(options) : undefined;
    return `${this._getBaseUrl()}/url/logout/${this.id}${!!params ? '?' + params.toString() : ''}`;
  }

  async getHandoverCode(accessToken: string): Promise<{code: string}>{
    // Throws valuable information if accessToken is not valid
    await this.contextHelper.getAuthContextVerified(accessToken);
    const body = { accessToken }
    const response = await this.getHttpClient().post<{code: string}>(`/handover/code/${this.id}`, body, { baseURL: this._getBaseUrl()});
    return response.data;
  }

  async getTokensAndVerify(code: string, options?: {redirectUri?: string}): Promise<{tokens: TokensResponse, authContext: AuthContext}> {
    const tokens = await this._getTokens(code, options);
    const authContext = await this.contextHelper.getAuthContextVerified(tokens.access_token);
    return {tokens, authContext};
  }

  private async _getTokens(code: string, options?: {redirectUri?: string}): Promise<TokensResponse> {
    const body = {...options, code}
    const response = await this.getHttpClient().post<TokensResponse>(`/token/code/${this.id}`, body, { baseURL: this._getBaseUrl()});
    return response.data;
  }

  async refreshTokensAndVerify(refreshToken: string): Promise<{tokens: TokensResponse, authContext: AuthContext}> {
    const tokens = await this._refreshTokens(refreshToken);
    const authContext = await this.contextHelper.getAuthContextVerified(tokens.access_token);
    return {tokens, authContext};
  }

  private async _refreshTokens(refreshToken: string): Promise<TokensResponse> {
    const response = await this.getHttpClient().post<TokensResponse>(`/token/refresh/${this.id}`, {refreshToken}, { baseURL: this._getBaseUrl()});
    return response.data;
  }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns 
   */
  private _getBaseUrl(): string {
    return process.env.NBLOCKS_AUTH_API_URL || this.BASE_URLS[this.getPlatformClient().stage];
  }
}