import { Entity } from '../../../abstracts/generic-entity';
import { SpecificEntity } from '../../../abstracts/specific-entity';
import { PrivilegeResponseDto } from './models/privilege-response.dto';
import { UpdatePrivilegeRequestDto } from './models/update-privilege-request.dto';

/**
 * A specific `Privilege` client for a particular privilege. 
 * Use this client to query or mutate data for this particular privilege
 */
export class Privilege extends SpecificEntity{

  //TODO swap params order
  constructor (parentEntity: Entity, id: string, debug = false) {
    super(id, parentEntity, debug);
  }

  /**
   * Gets the model for this privilege
   * @returns 
   */
  async get(): Promise<PrivilegeResponseDto> {
    return (await this.getHttpClient().get<PrivilegeResponseDto>(`/role/privilege/${this.id}`, { headers: this.getHeaders() })).data
  }

  /**
   * Update the privilege. You can edit description and key
   * @param args `UpdatePrivilegeRequestDto`
   * @returns `PrivilegeResponseDto`
   */
  async update(args: Partial<UpdatePrivilegeRequestDto>): Promise<PrivilegeResponseDto> {
    return (await this.getHttpClient().put<PrivilegeResponseDto>(`/role/privilege/${this.id}`, args, { headers: this.getHeaders() })).data
  }

  /**
   * Delete the privilege. Note that this will not delete connected roles
   */
  async delete(): Promise<void> {
    await this.getHttpClient().delete(`/role/privilege/${this.id}`, { headers: this.getHeaders() })
  }
}

