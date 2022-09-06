import axios, { AxiosError, AxiosInstance } from 'axios';
import { Auth } from './auth/auth';
import { AppModel } from './models/app.model';
import { Tenants } from './tenant/tenants';
import { Tenant } from './tenant/tenant';
import { Client } from '../abstracts/client';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { ForbiddenError } from '../errors/ForbiddenError';
import { ClientError } from '../errors/ClientError';
import { NotFoundError } from '../errors/NotFoundError';
import { UpdateCredentials } from './models/update-credentials-request.dto';

export type Stage = 'DEV' | 'STAGE' | 'PROD';

export class PlatformClient extends Client {

  private readonly BASE_URLS = {
    'PROD': 'https://account-api.nebulr-core.com',
    'STAGE': 'https://account-api-stage.nebulr-core.com',
    'DEV': 'http://account-api:3000'
  };
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;

  readonly stage: Stage
  readonly version: 1;

  /**
   * A generic Tenants client. 
   * Use this to create or list tenants
   */
  tenants: Tenants;

  /**
   * A generic Auth client.
   * Use this to query or mutate data for auth related operations
   */
  auth: Auth;

  constructor(apiKey: string, version: 1 = 1, debug = false, stage: Stage = 'PROD') {
    super(null, debug);
    this.apiKey = apiKey;
    this.version = version;
    this.stage = stage;

    this.httpClient = axios.create({
      baseURL: this.getApiBaseUrl(stage),
    });

    this.configureHttpClient(this.httpClient);

    this.auth = new Auth(this, this.debug);
    this.tenants = new Tenants(this, this.debug);

    this._log(`Initialized PlatformClient in stage ${this.stage} with base url: ${this.getApiBaseUrl(stage)}, apiKey: ${apiKey.substring(0, 5)}...`);
  }

  /** **Internal functionality. Do not use this function** */
  getPlatformClient(): PlatformClient {
    return this;
  }

  /** **Internal functionality. Do not use this function** */
  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  /** **Internal functionality. Do not use this function** */
  getHeaders(): Record<string, string> {
    return { "x-api-key": this.apiKey };
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

  /**
   * Gets the complete `App` model of your app.
   * The app is your top most entity and holds all configurations for how your App interacts with the platform in any sub call. 
   * Use this response data to alter your model and push back
   * @returns Returns AppModel
   */
  async getApp(): Promise<AppModel> {
    const response = await this.httpClient.get<AppModel>('/app', { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Shortcut to get the name of all your roles
   * @returns Returns a list of role names
   */
  async getAppRoleNames(): Promise<string[]> {
    this._log("listRoles");
    const app = await this.getApp();
    return Object.keys(app.roles);
  }

  /**
   * Updates your `App` model. 
   * * Setting the emailSenderEmail will trigger a verification email to be sent to the email address provided. Once verified all Nblocks emails will be send through this address.
   * * Altering your Business model will trigger a synchronization with your Stripe account (if credentials are setup)
   * @param model Your app model
   * @returns Returns AppModel
   */
  async updateApp(model: Partial<Omit<AppModel, "id" | "domain">>): Promise<AppModel> {
    return (await this.httpClient.put<AppModel>('/app', model, { headers: this.getHeaders() })).data;
  }

  /**
   * Store sensitive credentials for your app so NBlocks can authorize with 3d party services on your behalf.
   * These credentials are never outputted back again
   * 
   * E.g. Stripe integration, social login providers like Google, Facebook, Github etc.
   */
  async updateAppCredentials(credentials: UpdateCredentials): Promise<void> {
    await this.httpClient.put<void>('/app/credentials', credentials, { headers: this.getHeaders() });
  }

  /**
   * TODO FIX THIS
   * Create a checkout session with Stripe. Use the resulting session id to redirect users to Stripe Checkout using the Stripe SDK. https://stripe.com/docs/billing/subscriptions/checkout#add-redirect
   */
  async createCheckoutSession(): Promise<void> {

  }

  /** **Internal functionality. Do not use this function** */
  private getApiBaseUrl(stage: Stage): string {
    return process.env.NEBULR_PLATFORM_CORE_API_URL || this.BASE_URLS[stage];
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
