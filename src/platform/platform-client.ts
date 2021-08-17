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

  tenants: Tenants;
  auth: Auth;

  // Tenant agnostics
  //fileClient: FileClient;
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

    // Tenant agnostics
    //this.fileClient = new FileClient(this, this.debug);
    this.communicationClient = new CommunicationClient(this, this.debug);
  }
  
  /** Override */
  getPlatformClient(): PlatformClient {
    return this;
  }

  /** Override */
  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  /** Override */
  getHeaders(): Record<string, string> {
    return {"x-api-key": this.apiKey};
  }

  tenant(tenantId: string): Tenant {
    return new Tenant(this, tenantId, this.debug);
  }

  async getApp(): Promise<AppModel> {
    const response = await this.httpClient.get<AppModel>('/app', {headers: this.getHeaders()});
    return response.data;
  }

  async getAppRoleNames(): Promise<string[]> {
    this._log("listRoles");
    const app = await this.getApp();
    return Object.keys(app.roles);
  }

  async updateApp(model: Partial<Omit<AppModel, "id">>): Promise<AppModel> {
    return (await this.httpClient.put<AppModel>('/app', model, {headers: this.getHeaders()})).data;
  }

  async createCheckoutSession(): Promise<void> {
    
  }

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

      let customError: Error;
      switch (error.response.status) {
        case 401:
          customError = new UnauthenticatedError(`${error.response.status}: ${JSON.stringify(error.response.data)}`);
          break;

        case 403:
          customError = new ForbiddenError(`${error.response.status}: ${JSON.stringify(error.response.data)}`);
          break;
      
        default:
          customError = new Error(`Generic error: ${JSON.stringify(error.response.data)}`);
          break;
      }
      return Promise.reject(customError);
    });
  }
}
