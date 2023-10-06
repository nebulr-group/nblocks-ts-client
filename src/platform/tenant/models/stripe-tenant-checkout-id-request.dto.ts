import { PriceOffer } from "../../config/payments/price-offer";

export class StripeTenantCheckoutIdRequestDto {
    /** The plan key the customer which to checkout */
    planKey: string;

    /** Which offering (price) to chosse */
    priceOffer: PriceOffer;
}