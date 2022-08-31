import { Client } from '../../abstracts/client';
import { Tenant } from '../tenant/tenant';
import { CreateFromHtmlArgsDto } from './models/create-from-html-args.dto';
import { CreateFromHtmlRequestDto } from './models/create-from-html-request.dto';
import { CreateFromHtmlResponseDto } from './models/create-from-html-response.dto';
import { CreatePresignedPostResponseDto } from '../file/models/create-presigned-post-response.dto';

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
   * @param args 
   * 
   * @returns Zip file AWS S3 key
   */
  async createFromHtml(args: CreateFromHtmlArgsDto): Promise<CreateFromHtmlResponseDto> {
    const reqArgs: CreateFromHtmlRequestDto = { ...args, tenantId: this.tenantId };
    const session = (await this.getHttpClient().post<CreatePresignedPostResponseDto>(
      `pdf/createFromHtml`,
      reqArgs,
      { headers: this.getHeaders(), baseURL: this._getBaseUrl() })
    ).data;
    return { key: session.fields['key'] };
  }

  /**
  * Gets the base url by fetching current stage from Platform
  * 
  * @returns 
  */
  private _getBaseUrl(): string {
    return process.env.NEBULR_PDF_SERVICE_API_URL || this.BASE_URLS[this.getPlatformClient().stage];
  }
}