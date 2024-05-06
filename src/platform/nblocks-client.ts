import axios, { AxiosError, AxiosInstance } from 'axios';
import { Auth } from './auth/auth';
import { Tenants } from './tenant/tenants';
import { Tenant } from './tenant/tenant';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { ForbiddenError } from '../errors/ForbiddenError';
import { ClientError } from '../errors/ClientError';
import { NotFoundError } from '../errors/NotFoundError';
import { AuthContextHelper } from './auth/auth-context-helper';
import { Config } from './config/config';
import { SpecificEntity } from '../abstracts/specific-entity';
import { OAuth } from './auth/oauth';
import { Flag } from './flag/flag';

export type Stage = 'DEV' | 'STAGE' | 'PROD';

/**
 * This is the core Nblocks client.
 * This exposes all Nblocks features using sub clients.
 */
export class NblocksClient extends SpecificEntity {

  private readonly BASE_URLS = {
    'PROD': 'https://account-api.nebulr-core.com',
    'STAGE': 'https://account-api-stage.nebulr-core.com',
    'DEV': 'http://account-api:3000'
  };

  /**
   * The core Axios Http client instance. This instance intercepted for errors and is reused by all sub clients
   */
  private readonly httpClient: AxiosInstance;

  private readonly apiKey: string;

  private jwt?: string;

  readonly stage: Stage
  readonly version: number;

  /**
   * A generic Tenants client. 
   * Use this to create or list tenants
   */
  tenants: Tenants;

  /**
   * @deprecated Use local JWT and the new Auth client instead
   * A generic Auth client.
   * Use this to query or mutate data for auth related operations
   */
  authLegacy: Auth;

  /** A helper to configure your app in Nblocks */
  config: Config;

  /**
   * Auth, contains utils and AuthContextHelper etc.
   * Use this to resolve user JTWs. All JTWs are checked for integrity and security
   */
  auth: OAuth;

  flag: Flag;

  constructor(args: {appId: string, apiKey?: string, version?: number, debug?: boolean, stage?: Stage}) {
    const appId = args.appId;
    super(appId, null, args.debug);

    this.apiKey = args.apiKey || process.env.NBLOCKS_API_KEY;
    this.version = args.version || 1;
    this.stage = args.stage || 'PROD';

    this.httpClient = axios.create({
      baseURL: this.getApiBaseUrl(this.stage),
    });

    this.configureHttpClient(this.httpClient);

    this.authLegacy = new Auth(this, this.debug);

    this.tenants = new Tenants(this, this.debug);

    this.config = new Config(this, this.debug);

    this.auth = new OAuth(this, this.debug);

    this.flag = new Flag(this, this.debug);

    this._log(`Initialized NblocksClient in stage ${this.stage} with base url: ${this.getApiBaseUrl(this.stage)}, apiKey: ${this.apiKey?.substring(0, 5)}...`);
  }

  /** **Internal functionality. Do not use this function** */
  getPlatformClient(): NblocksClient {
    return this;
  }

  /** **Internal functionality. Do not use this function** */
  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  /** **Internal functionality. Do not use this function** */
  getHeaders(): Record<string, string> {
    if (this.jwt) {
      return { "Authorization": `Bearer ${this.jwt}` };
    } else {
      return { "x-api-key": this.apiKey };
    }
  }

  /**
   * Gets a specific `Tenant` client for a particular Tenant id.
   * Use this client to query or mutate data for a particular tenant
   * @param tenantId
   * @returns Returns an instance of a Tenant client
   */
  tenant(tenantId: string): Tenant {
    return new Tenant(this, tenantId, this.debug);
  }

  setJwt(token: string): void {
    this.jwt = token;
  }

  /** **Internal functionality. Do not use this function** */
  private getApiBaseUrl(stage: Stage): string {
    return process.env.NBLOCKS_ACCOUNT_API_URL || this.BASE_URLS[stage];
  }

  private configureHttpClient(httpClient: AxiosInstance): void {
    const debug = this.debug;
    if (debug) {
      httpClient.interceptors.request.use(request => {
        console.log(`${request.method.toUpperCase()} ${request.baseURL}/${request.url}`, "Headers", request.headers);
        console.log("Body:", request.data);
        return request;
      });
    }

    httpClient.interceptors.response.use(function (response) {
      if (debug) {
        console.log("Response:", response.status, response.data);
      }
      return response;
    }, function (error: AxiosError) {

      if (debug) {
        console.log("Error response:", `Http status: ${error.response.status}`, error.response.data);
      }

      if (!error.response)
        return Promise.reject(error);

      let customError: Error;
      switch (error.response.status) {
        case 401:
          customError = new UnauthenticatedError(error.response.data);
          break;

        case 403:
          customError = new ForbiddenError(error.response.data);
          break;

        case 404:
          customError = new NotFoundError(error.response.data);
          break;

        default:
          customError = new ClientError(error.response.data);
          break;
      }
      return Promise.reject(customError);
    });
  }
}
