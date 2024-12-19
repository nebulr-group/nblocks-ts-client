import { PlanResponse } from "../../config/payments/plan-response";
import { Price } from "../../config/payments/price";

export class TenantPlanDetails {
    plan?: PlanResponse;
    price?: Price;
    trial: boolean;
    trialDaysLeft: number;
}