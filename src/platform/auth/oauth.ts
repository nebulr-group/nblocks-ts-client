import { SpecificEntity } from '../../abstracts/specific-entity';
import { NblocksPublicClient } from '../nblocks-public-client';
import { AuthContextHelper } from './auth-context-helper';
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
  context: AuthContextHelper;

  constructor (parentEntity: NblocksPublicClient, debug = false) {
    super(parentEntity.appId, parentEntity, debug);
    new AuthContextHelper(parentEntity.stage, this.debug);
  }

  /** Get entrypoint to the login flow. Redirect your user to this url */
  getLoginUrl(options?: {redirectUri?: string, state?: string}): string {
    const params = options ? new URLSearchParams(options) : undefined;
    return `${this._getBaseUrl()}/url/login/${this.id}${!!params ? '?' + params.toString() : ''}`;
  }

  // async getHandoverUrl(flow: 'payment'): Promise<string>{
  // }

  async getTokens(code: string, options?: {redirectUri?: string}): Promise<TokensResponse> {
    const body = {...options, code}
    const response = await this.getHttpClient().post<TokensResponse>(`${this._getBaseUrl()}/token/${this.id}/code`, body, { baseURL: this._getBaseUrl()});
    return response.data;
  }

  async refreshTokens(refreshToken: string): Promise<TokensResponse> {
    const response = await this.getHttpClient().post<TokensResponse>(`${this._getBaseUrl()}/token/${this.id}/refresh`, {refreshToken}, { baseURL: this._getBaseUrl()});
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