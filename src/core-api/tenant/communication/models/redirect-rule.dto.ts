import { RedirectTarget } from "./redirect-target.dto";

export class RedirectRuleDto {
    id?: string;

    /* Triggered phone number purchased in Twilio */
    phoneNumber: string;

    /* Target phone numbers or agents that the caller should be redirected to in right order */
    targets: RedirectTarget[];

    /* Hide caller phone number to targets */
    anonymous: boolean;
}