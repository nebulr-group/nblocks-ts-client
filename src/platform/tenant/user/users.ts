import { Entity } from '../../../abstracts/generic-entity';
import { CreateUserRequestDto } from './models/create-user-request.dto';
import { TenantUserResponseDto } from './models/tenant-user-response.dto';

export class Users extends Entity {

  constructor (parentEntity: Entity, debug:boolean) {
    super(parentEntity, debug);
  }

  async create(data: CreateUserRequestDto): Promise<TenantUserResponseDto> {
    return (await this.getHttpClient().post<TenantUserResponseDto>('/tenant/user', data, { headers: this.getHeaders() })).data
  }

  async list(): Promise<TenantUserResponseDto[]> {
    return (await this.getHttpClient().get<TenantUserResponseDto[]>('/tenant/user', { headers: this.getHeaders() })).data;
  }
}
