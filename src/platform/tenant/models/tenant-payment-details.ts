import { TenantPaymentStatus } from "./tenant-payment-status";
import { TenantPlanDetails } from "./tenant-plan-details";


export interface TenantPaymentDetails {
    status: TenantPaymentStatus;
    details: TenantPlanDetails;
}