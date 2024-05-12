import { Client } from '../../abstracts/client';
import { ConfigHelper } from '../../shared/config';
import { Tenant } from '../tenant/tenant';
import { CreateArgsDto } from './models/create-args.dto';
import { CreateRequestDto } from './models/create-request.dto';
import { CreateResponseDto } from './models/create-response.dto';

export class PdfServiceClient extends Client {

  readonly tenantId: string;

  private readonly BASE_URLS = {
    'PROD': 'https://pdf-service-api.nebulr-core.com',
    'STAGE': 'https://pdf-service-api-stage.nebulr-core.com',
    'DEV': 'http://pdf-service-api:3000'
  };

  constructor(parentEntity: Tenant, debug = false) {
    super(parentEntity, debug);
    this.tenantId = parentEntity.id;
  }

  /**
   * Generate PDF file on the base of provided HTML file
   * @param args CreateArgsDto
   * 
   * @returns CreateResponseDto
   */
  async createFromHtml(args: CreateArgsDto): Promise<CreateResponseDto> {
    const reqArgs: CreateRequestDto = { ...args, tenantId: this.tenantId };
    const response = (await this.getHttpClient().post<CreateResponseDto>(
      `pdf/createFromHtml`,
      reqArgs,
      { headers: this.getHeaders(), baseURL: this._getBaseUrl() })
    ).data;
    return response;
  }

  /**
   * Generate PDF file based on URL
   * @param args CreateArgsDto
   * 
   * @returns CreateResponseDto
   */
   async createFromUrl(args: CreateArgsDto): Promise<CreateResponseDto> {
    const reqArgs: CreateRequestDto = { ...args, tenantId: this.tenantId };
    const response = (await this.getHttpClient().post<CreateResponseDto>(
      `pdf/createFromHtml`,
      reqArgs,
      { headers: this.getHeaders(), baseURL: this._getBaseUrl() })
    ).data;
    return response;
  }
  

  /**
  * Gets the base url by fetching current stage from Platform
  * 
  * @returns 
  */
  private _getBaseUrl(): string {
    return ConfigHelper.getEnvVariable("NBLOCKS_PDF_SERVICE_API_URL") || this.BASE_URLS[this.getPlatformClient().stage];
  }
}