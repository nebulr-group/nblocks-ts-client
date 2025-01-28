import { PlanResponse } from "./plan-response";
import { Price } from "./price";

export class UpdatePlanRequestDto implements Partial<Pick<PlanResponse, 'name' | 'description' | 'trial' | 'trialDays' | 'prices'>> {
    name?: string;
    description?: string;
    trial?: boolean;
    trialDays?: number;
    prices?: Price[];
}