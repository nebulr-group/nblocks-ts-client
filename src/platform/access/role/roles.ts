import { Entity } from '../../../abstracts/generic-entity';
import { CreateRoleRequestDto } from './models/create-role-request.dto';
import { RoleResponseDto } from './models/role-response.dto';

/**
 * A generic `Role` client.
 * Use this to create or list roles
 */
export class Roles extends Entity {

  constructor (parentEntity: Entity, debug:boolean) {
    super(parentEntity, debug);
  }

  /**
   * This will create a new role
   * @param args `CreateRoleRequestDto`
   * @returns `RoleResponseDto`
   */
  async create(data: CreateRoleRequestDto): Promise<RoleResponseDto> {
    return (await this.getHttpClient().post<RoleResponseDto>('/role', data, { headers: this.getHeaders() })).data
  }

  /**
   * List all roles
   * @returns List of `RoleResponseDto`
   */
  async list(): Promise<RoleResponseDto[]> {
    return (await this.getHttpClient().get<RoleResponseDto[]>('/role', { headers: this.getHeaders() })).data;
  }
}
