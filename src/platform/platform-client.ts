import axios, { AxiosError, AxiosInstance } from 'axios';
import { Auth } from './auth/auth';
import { AppModel } from './models/app.model';
import { Tenants } from './tenant/tenants';
import { Tenant } from './tenant/tenant';
import { Client } from '../abstracts/client';
import { FileClient } from './file/file';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { ForbiddenError } from '../errors/ForbiddenError';
import { CommunicationClient } from './communication/communication';

export type Stage = 'DEV' | 'STAGE' | 'PROD';

export class PlatformClient extends Client {
  
  private readonly BASE_URLS = {
    'PROD':'https://account-api.nebulr-core.com',
    'STAGE':'https://account-api-stage.nebulr-core.com',
    'DEV':'http://localhost:3010'
  };
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;

  readonly stage: Stage
  readonly version : 1;

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

  //fileClient: FileClient;

  /**
   * A generic communication client.
   * Use this to tool to send emails and text messages to anyone.
   * 
   * Do you wish to communicate easier directly with a known user? See `User` client, avaiable via `tenant(id).user(id).sendEmail()`
   */
  communicationClient: CommunicationClient;

  constructor (apiKey: string, version : 1 = 1, debug = false, stage: Stage = 'PROD') {
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

    //this.fileClient = new FileClient(this, this.debug);
    this.communicationClient = new CommunicationClient(this, this.debug);
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
    return {"x-api-key": this.apiKey};
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
    const response = await this.httpClient.get<AppModel>('/app', {headers: this.getHeaders()});
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
    return (await this.httpClient.put<AppModel>('/app', model, {headers: this.getHeaders()})).data;
  }

  /**
   * TODO FIX THIS
   * Store sensitive credentials for your app so nBlocks can authorize with 3d party services on your behalf.
   * 
   * E.g. Stripe integration, social login providers like Google, Facebook, Github etc.
   */
   async updateAppCredentials(credentials: Record<string, string>): Promise<void> {
    
  }

  /**
   * TODO FIX THIS
   * Create a checkout session with Stripe. Use the resulting session id to redirect users to Stripe Checkout using the Stripe SDK. https://stripe.com/docs/billing/subscriptions/checkout#add-redirect
   */
  async createCheckoutSession(): Promise<void> {
    
  }

  /** **Internal functionality. Do not use this function** */
  private getApiBaseUrl(stage: Stage): string {
    return this.BASE_URLS[stage];
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
      if (!error.response)
        return Promise.reject(error);

      const customError = new Error(`${JSON.stringify(error.response.data)}`);
      return Promise.reject(customError);
    });
  }
}
