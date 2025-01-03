import { PriceOffer } from "../../config/payments/price-offer";
import { CustomParam } from "../../models/custom-params-config.model";

export class CreateTenantRequestDto {
    /** The plan key. The plan must be present in the configured App business model */
    plan?: string;

    /** If a specific pricing offer should be used. Use this if you offer the same plan in multiple periods or currencies. Otherwise the first price will be used */
    priceOffer?: PriceOffer;

    /** A user will need to be assigned as an owner to this tenant. Either reused if the user already exist or a new user will be created. The user will be onboarded automatically */
    owner: TenantOwnerRequestDto;

    /** Name of the tenant. Can also be set by tenant owner during onboarding */
    name?: string;

    /** Is this tenant considered onboarded or not */
    onboarded?: boolean;

    /** A url to a logo. Can also be set by tenant owner during onboarding */
    logo?: string;

    /** The default locale / lang code for all users in this tenant (`ISO_639-1` format).
     * This property will set the i18n for all platform emails and can be used to. 
     * Defaults to 'en'
     */
    locale?: string;

    /** Store metadata for your own business logic that will be returned in every Tenant response. This data will never be outputted to the end user */
    metadata?: Record<string, string>;
}

export class TenantOwnerRequestDto {
    /** Required */
    email: string;

    /** The first name */
    firstName?: string;

    /** The last name */
    lastName?: string;
    
    /** Set this variable to true if you don't wish to send out any notifications to the new user */
    muteNotifications?: boolean;

    customParams?: CustomParam[];
}