import { Entity } from '../../abstracts/generic-entity';
import { SpecificEntity } from '../../abstracts/specific-entity';

export class Portal extends Entity{

  private readonly BASE_URLS = {
    'PROD': 'https://backendless.nblocks.cloud',
    'STAGE': 'https://backendless-stage.nblocks.cloud',
    'DEV': 'http://localhost:3080'
  };

  constructor (parentEntity: SpecificEntity, debug = false) {
    super(parentEntity, debug);
  }

  getSelectPlanUrl(handoverCode: string): string{
    return `${this._getBaseUrl()}/subscription-portal/selectPlan?code=${handoverCode}`
  }

  getUserManagementUrl(handoverCode: string): string{
    return `${this._getBaseUrl()}/user-management-portal/users?code=${handoverCode}`
  }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns 
   */
  private _getBaseUrl(): string {
    return process.env.NBLOCKS_BACKENDLESS_API_URL || this.BASE_URLS[this.getPlatformClient().stage];
  }
}