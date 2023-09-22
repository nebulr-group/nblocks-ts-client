import { BusinessModel } from "./business-model";
import { OnboardingFlow } from "./onboarding-flow";

export class AppModel {
    /** Unique ID (Read only) */
    id: string;

    /** Name of the app */
    name: string;
  
    /** Unique domain name of the app (Read only) */
    domain: string;
  
    /** URL to your api (to receive webhooks etc). **Must be HTTPS** */
    apiUrl: string;
  
    /** URL to your frontend app (for onboarding redirects etc). **Must be HTTPS** */
    uiUrl: string;

    /** Events like tenant and user updates will be sent to this webhook url */
    webhookUrl?: string;
  
    /** The business model defines what plans are available to subscribe to and what taxes applies. */
    businessModel: BusinessModel;
  
    /** URL to your logo */
    logo: string;
  
    /** URL to your website or landing page. E.g. Branded emails will link to this URL, checkout process will redirect to `/payment-success` and `/payment-cancel` */
    websiteUrl: string;
  
    /** URL to a page on your website containing a Privacy policy for your app users. E.g. checkout process will link to this url. */
    privacyPolicyUrl: string;
  
    /** URL to a page on your website containing a Terms of service for your app users. E.g. checkout process will link to this url. */
    termsOfServiceUrl: string;

    /** Emails sent from Nblocks will have this sender name */
    emailSenderName: string;

    /** Emails sent from Nblocks will have this sender email. You'll have to verify this email before */
    emailSenderEmail: string;

    /** Boolean value telling the user if passkeys login is enabled */
    passkeysEnabled: boolean;

    /** Boolean value telling the user if Stripe is enabled (Read only) */
    stripeEnabled: boolean;

    /** Boolean value telling the user if Google Social login / SSO is enabled (Read only) */
    googleSsoEnabled: boolean;

    /** Boolean value telling the user if Azure AD SSO is enabled (Read only) */
    azureAdSsoEnabled: boolean;

    /** Boolean value telling the user if Azure marketplace is enabled (Read only) */
    azureMarketplaceEnabled: boolean;

    /** Configure how users will be onboarded */
    onboardingFlow: OnboardingFlow;

    /** Toggle this to true if you want to use a UI provided by NBlocks instead of your own */
    cloudViews: boolean;

    /** Allowed redirect uris */
    redirectUris: string[];

    /** Default handover/callback uri used by Nblocks */
    defaultCallbackUri: string;

}
