import { Entity } from '../../../../abstracts/generic-entity';
import { CreatePrivilegeRequestDto } from './models/create-privilege-request.dto';
import { PrivilegeResponseDto } from './models/privilege-response.dto';

/**
 * A generic `Privilege` client.
 * Use this to create or list privileges
 */
export class Privileges extends Entity {

  constructor (parentEntity: Entity, debug:boolean) {
    super(parentEntity, debug);
  }

  /**
   * This will create a new privilege
   * @param args `CreatePrivilegeRequestDto`
   * @returns `PrivilegeResponseDto`
   */
  async create(data: CreatePrivilegeRequestDto): Promise<PrivilegeResponseDto> {
    return (await this.getHttpClient().post<PrivilegeResponseDto>('/role/privilege', data, { headers: this.getHeaders() })).data
  }

  /**
   * List all privileges
   * @returns List of `PrivilegeResponseDto`
   */
  async list(): Promise<PrivilegeResponseDto[]> {
    return (await this.getHttpClient().get<PrivilegeResponseDto[]>('/role/privilege', { headers: this.getHeaders() })).data;
  }
}
