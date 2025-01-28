import { Entity } from '../../abstracts/generic-entity';
import { ConfigHelper } from '../../shared/config';
import { Flag, FlagInput } from './models/flag';
import { Segment, SegmentInput } from './models/segment';

export class FlagAdmin extends Entity{

  private readonly BASE_URLS = {
    'PROD': 'https://admin-api.nblocks.cloud',
    'STAGE': 'https://admin-api-stage.nblocks.cloud',
    'DEV': 'http://admin-api:3000'
  };

  constructor (parentEntity: Entity, debug = false) {
    super(parentEntity, debug);
  }

  async listFlags(): Promise<Flag[]>{
    const response = await this.getHttpClient().get<Flag[]>(`/flags/flags`, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  async createFlag(flag: FlagInput): Promise<Flag>{
    const response = await this.getHttpClient().post<Flag>(`/flags/flag`, flag, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  async updateFlag(id: string, flag: FlagInput): Promise<Flag>{
    const response = await this.getHttpClient().put<Flag>(`/flags/flag/${id}`, flag, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  async deleteFlag(id: string): Promise<void>{
    const response = await this.getHttpClient().delete<void>(`/flags/flag/${id}`, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  async listSegments(): Promise<Segment[]>{
    const response = await this.getHttpClient().get<Segment[]>(`/flags/segments`, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  async createSegment(segment: SegmentInput): Promise<Segment>{
    const response = await this.getHttpClient().post<Segment>(`/flags/segment`, segment, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  async updateSegment(id: string, segment: SegmentInput): Promise<Segment>{
    const response = await this.getHttpClient().put<Segment>(`/flags/segment/${id}`, segment, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  async deleteSegment(id: string): Promise<void>{
    const response = await this.getHttpClient().delete<void>(`/flags/segment/${id}`, { headers: this.getHeaders(), baseURL: this._getBaseUrl()});
    return response.data;
  }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns 
   */
  private _getBaseUrl(): string {
    return ConfigHelper.getEnvVariable("NBLOCKS_ADMIN_API_URL") || this.BASE_URLS[this.getPlatformClient().stage];
  }
}