import axios, { AxiosError, AxiosInstance } from 'axios';
import { Client } from '../abstracts/client';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { ForbiddenError } from '../errors/ForbiddenError';
import { ClientError } from '../errors/ClientError';
import { NotFoundError } from '../errors/NotFoundError';
import { AuthContextHelper } from './auth/auth-context-helper';

export type Stage = 'DEV' | 'STAGE' | 'PROD';

/**
 * This is the Public Nblocks client.
 * This exposes all Nblocks features that can be used in a public context. You only idenfy with app id.
 */
export class NblocksPublicClient extends Client {

  private readonly BASE_URLS = {
    'PROD': 'https://account-api.nebulr-core.com',
    'STAGE': 'https://account-api-stage.nebulr-core.com',
    'DEV': 'http://account-api:3000'
  };

  /**
   * The core Axios Http client instance. This instance intercepted for errors and is reused by all sub clients
   */
  private readonly httpClient: AxiosInstance;

  readonly appId: string;

  readonly stage: Stage
  readonly version: number;

  /**
   * AuthContext helper.
   * Use this to resolve user JTWs. All JTWs are checked for integrity and security
   */
  auth: AuthContextHelper;

  constructor(appId: string, args: {version?: number, debug?: boolean, stage?: Stage}) {
    super(null, args.debug);

    this.appId = appId
    this.version = args.version || 1;
    this.stage = args.stage || 'PROD';

    this.httpClient = axios.create({
      baseURL: this.getApiBaseUrl(this.stage),
    });

    this.configureHttpClient(this.httpClient);

    this.auth = new AuthContextHelper(this.stage, this.debug);

    this._log(`Initialized NblocksPublicClient in stage ${this.stage} with base url: ${this.getApiBaseUrl(this.stage)}, app id: ${this.appId}`);
  }

  /** **Internal functionality. Do not use this function** */
  getPlatformClient(): NblocksPublicClient {
    return this;
  }

  /** **Internal functionality. Do not use this function** */
  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  /** **Internal functionality. Do not use this function** */
  private getApiBaseUrl(stage: Stage): string {
    return process.env.NBLOCKS_CORE_API_URL || this.BASE_URLS[stage];
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
