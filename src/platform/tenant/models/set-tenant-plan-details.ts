import { PriceOffer } from "../../config/payments/price-offer";

export class SetTenantPlanDetails {
    planKey: string;
    price: PriceOffer;
}