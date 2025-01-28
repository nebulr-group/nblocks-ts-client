import { PlanResponse } from "./plan-response";
import { Price } from "./price";

export class CreatePlanRequest implements Partial<Pick<PlanResponse, 'key' | 'name' | 'description' | 'trial' | 'trialDays' | 'prices'>> {
    key?: string;
    name?: string;
    description?: string;
    trial?: boolean;
    trialDays?: number;
    prices?: Price[];
}