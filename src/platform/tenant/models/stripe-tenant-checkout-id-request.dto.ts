export class StripeTenantCheckoutIdRequestDto {
    /** The plan the customer which to checkout */
    plan: string;

    /** If there's multi region plans you need to provide the region to fetch the correct currencies and taxes */
    region?: string;
}
