import { Entity } from "../../../abstracts/generic-entity";
import { NblocksClient } from "../../nblocks-client";
import { CreateFederationConnectionRequest } from "./create-federation-connection.request";
import { FederationConnectionResponse } from "./federation-connection-response";
import { UpdateFederationConnectionRequest } from "./update-federation-connection.request";

export class Federation extends Entity {
  
  constructor(client: NblocksClient, debug?: boolean) {
    super(client, debug);
  }

  async list(): Promise<FederationConnectionResponse[]> {
    const response = await this.parentEntity.getHttpClient().get<FederationConnectionResponse[]>('/federation/connection', { headers: this.getHeaders() });
    return response.data;
  }

  async get(id: string): Promise<FederationConnectionResponse> {
    const response = await this.parentEntity.getHttpClient().get<FederationConnectionResponse>(`/federation/connection/${id}`, { headers: this.getHeaders() });
    return response.data;
  }

  async create(args: CreateFederationConnectionRequest): Promise<FederationConnectionResponse> {
    const response = await this.parentEntity.getHttpClient().post<FederationConnectionResponse>(`/federation/connection`, args, { headers: this.getHeaders() });
    return response.data;
  }

  async update(id: string, args: UpdateFederationConnectionRequest): Promise<FederationConnectionResponse> {
    const response = await this.parentEntity.getHttpClient().put<FederationConnectionResponse>(`/federation/connection/${id}`, args, { headers: this.getHeaders() });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.parentEntity.getHttpClient().delete<void>(`/federation/connection/${id}`, { headers: this.getHeaders() });
  }
}