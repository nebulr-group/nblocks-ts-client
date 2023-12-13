import { Entity } from '../../../../abstracts/generic-entity';
import { SpecificEntity } from '../../../../abstracts/specific-entity';
import { RoleResponseDto } from './models/role-response.dto';
import { UpdateRoleRequestDto } from './models/update-role-request.dto';

/**
 * A specific `Role` client for a particular role. 
 * Use this client to query or mutate data for this particular role
 */
export class Role extends SpecificEntity{

  //TODO swap params order
  constructor (parentEntity: Entity, id: string, debug = false) {
    super(id, parentEntity, debug);
  }

  /**
   * Gets the model for this role
   * @returns 
   */
  async get(): Promise<RoleResponseDto> {
    return (await this.getHttpClient().get<RoleResponseDto>(`/role/${this.id}`, { headers: this.getHeaders() })).data
  }

  /**
   * Update the role. You can edit connected privileges, info attributes and default state
   * @param args `UpdateRoleRequestDto`
   * @returns `RoleResponseDto`
   */
  async update(args: Partial<UpdateRoleRequestDto>): Promise<RoleResponseDto> {
    return (await this.getHttpClient().put<RoleResponseDto>(`/role/${this.id}`, args, { headers: this.getHeaders() })).data
  }

  /**
   * Delete the role. Note that this will not delete connected privileges
   */
  async delete(): Promise<void> {
    await this.getHttpClient().delete(`/role/${this.id}`, { headers: this.getHeaders() })
  }
}

