import { PriceOffer } from "../../config/payments/price-offer";

export class StripeTenantCheckoutIdRequestDto {
    /** The plan key the customer which to checkout */
    plan: string;

    priceOffer: PriceOffer;
}