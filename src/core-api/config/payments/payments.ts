import { Entity } from "../../../abstracts/generic-entity";
import { NblocksClient } from "../../nblocks-client";
import { CreatePlanRequest } from "./create-plan.request";
import { CreateTaxRequest } from "./create-tax.request";
import { PlanResponse } from "./plan-response";
import { TaxResponse } from "./tax-response";
import { UpdatePlanRequestDto } from "./update-plan.request";
import { UpdateTaxRequest } from "./update-tax.request";

export class Payments extends Entity {
  
  constructor(client: NblocksClient, debug?: boolean) {
    super(client, debug);
  }

    /** Payment plans */
  async listPlans(): Promise<PlanResponse[]> {
    const response = await this.parentEntity.getHttpClient().get<PlanResponse[]>('/payments/plan', { headers: this.getHeaders() });
    return response.data;
  }

  async getPlan(id: string): Promise<PlanResponse> {
    const response = await this.parentEntity.getHttpClient().get<PlanResponse>(`/payments/plan/${id}`, { headers: this.getHeaders() });
    return response.data;
  }

  async createPlan(args: CreatePlanRequest): Promise<PlanResponse> {
    const response = await this.parentEntity.getHttpClient().post<PlanResponse>(`/payments/plan`, args, { headers: this.getHeaders() });
    return response.data;
  }

  async updatePlan(id: string, args: UpdatePlanRequestDto): Promise<PlanResponse> {
    const response = await this.parentEntity.getHttpClient().put<PlanResponse>(`/payments/plan/${id}`, args, { headers: this.getHeaders() });
    return response.data;
  }

  async deletePlan(id: string): Promise<void> {
    await this.parentEntity.getHttpClient().delete<void>(`/payments/plan/${id}`, { headers: this.getHeaders() });
  }

  /** Payment Taxes */
  async listTaxes(): Promise<TaxResponse[]> {
    const response = await this.parentEntity.getHttpClient().get<TaxResponse[]>('/payments/tax', { headers: this.getHeaders() });
    return response.data;
  }

  async getTax(id: string): Promise<TaxResponse> {
    const response = await this.parentEntity.getHttpClient().get<TaxResponse>(`/payments/tax/${id}`, { headers: this.getHeaders() });
    return response.data;
  }

  async createTax(args: CreateTaxRequest): Promise<TaxResponse> {
    const response = await this.parentEntity.getHttpClient().post<TaxResponse>(`/payments/tax`, args, { headers: this.getHeaders() });
    return response.data;
  }

  async updateTax(id: string, args: UpdateTaxRequest): Promise<TaxResponse> {
    const response = await this.parentEntity.getHttpClient().put<TaxResponse>(`/payments/tax/${id}`, args, { headers: this.getHeaders() });
    return response.data;
  }

  async deleteTax(id: string): Promise<void> {
    await this.parentEntity.getHttpClient().delete<void>(`/payments/tax/${id}`, { headers: this.getHeaders() });
  }
}