import { SpecificEntity } from '../../abstracts/specific-entity';
import { ConfigHelper } from '../../shared/config';
import { BulkEvaluationResponse } from './models/bulk-evaluation-response';
import { BodyWithCtxAndToken } from './models/context';
import { EvaluationResponse } from './models/evaluation-response';

export class Flag extends SpecificEntity{

  private readonly BASE_URLS = {
    'PROD': 'https://backendless.nblocks.cloud',
    'STAGE': 'https://backendless-stage.nblocks.cloud',
    'DEV': 'http://localhost:3080'
  };

  constructor (parentEntity: SpecificEntity, debug = false) {
    super(parentEntity.id, parentEntity, debug);
  }

  async evaluate(flagKey: string, contextData?: BodyWithCtxAndToken): Promise<EvaluationResponse>{
    const response = await this.getHttpClient().post<EvaluationResponse>(`/flags/evaluate/${this.id}/${flagKey}`, contextData, { baseURL: this._getBaseUrl()});
    return response.data;
  }

  async bulkEvaluate(contextData?: BodyWithCtxAndToken): Promise<BulkEvaluationResponse>{
    const response = await this.getHttpClient().post<BulkEvaluationResponse>(`/flags/bulkEvaluate/${this.id}`, contextData, { baseURL: this._getBaseUrl()});
    return response.data;
  }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns 
   */
  private _getBaseUrl(): string {
    return ConfigHelper.getEnvVariable("NBLOCKS_BACKENDLESS_API_URL") || this.BASE_URLS[this.getPlatformClient().stage];
  }
}