import { Entity } from '../../abstracts/generic-entity';
import { NblocksClient } from '../nblocks-client';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { EventResponseDto } from './dto/event-response.dto';

export class NblocksEvent extends Entity {
  constructor(parentEntity: NblocksClient, debug: boolean) {
    super(parentEntity, debug);
  }

  async create(args: CreateEventRequestDto): Promise<EventResponseDto> {
    return (await this.getHttpClient().post<EventResponseDto>(`/event`, args, { headers: this.getHeaders() })).data;
  }

  async list(): Promise<EventResponseDto[]> {
    return (await this.getHttpClient().get<EventResponseDto[]>(`/event`, { headers: this.getHeaders() })).data;
  }

  async delete(id: string): Promise<void> {
    await this.getHttpClient().delete(`/event/${id}`, { headers: this.getHeaders() });
  }


}
