import { Entity } from "../../abstracts/generic-entity";
import { AppModel } from "../models/app.model";
import { CredentialsStateModel } from "../models/credentials-state.model";
import { CustomParamsConfig, ParamConfig } from "../models/custom-params-config.model";
import { UpdateAppRequest } from "../models/update-app-request";
import { UpdateCredentials } from "../models/update-credentials-request.dto";
import { NblocksClient } from "../nblocks-client";
import { CommunicationClient } from "../tenant/communication/communication";
import { EmailTemplateResponseDto } from "../tenant/communication/models/get-email-template-response.dto";
import { TemplateName } from "../tenant/communication/models/template-name.type";
import { UpdateEmailTemplateRequestDto } from "../tenant/communication/models/update-email-template-request.dto";
import { Access } from "./access/access";
import { Federation } from "./federation-connection/federation";
import { Payments } from "./payments/payments";

/**
 * Here we collect everything you can configure for your app in nblocks. These configurations is on the app level.
 */
export class Config extends Entity {
  private readonly _communicationClient: CommunicationClient;

  /** A helper to configure plans, prices and taxes in Nblocks */
  readonly payments: Payments;

  /** A helper to configure federation connections, like SAML and OIDC */
  readonly federation: Federation;

  /** A helper to configure roles and privileges in Nblocks */
  readonly access: Access;

  constructor(client: NblocksClient, debug?: boolean) {
    super(client, debug);
    this._communicationClient = new CommunicationClient(client, debug);
    this.payments = new Payments(client, debug);
    this.federation = new Federation(client, debug);
    this.access = new Access(client, this.debug);
  }

  /**
   * Gets the complete `App` model of your app.
   * The app is your top most entity and holds all configurations for how your App interacts with the platform in any sub call.
   * Use this response data to alter your model and push back
   * @returns Returns AppModel
   */
  async getAppProfile(): Promise<AppModel> {
    const response = await this.parentEntity
      .getHttpClient()
      .get<AppModel>("/app", { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Updates your `App` model.
   * * Setting the emailSenderEmail will trigger a verification email to be sent to the email address provided. Once verified all Nblocks emails will be send through this address.
   * * Altering your Business model will trigger a synchronization with your Stripe account (if credentials are setup)
   * @param model Your app model
   * @returns Returns AppModel
   */
  async updateAppProfile(model: UpdateAppRequest): Promise<AppModel> {
    const response = await this.parentEntity
      .getHttpClient()
      .put<AppModel>("/app", model, { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Store sensitive credentials for your app so NBlocks can authorize with 3d party services on your behalf.
   * These credentials are never outputted back again
   *
   * E.g. Stripe integration, social login providers like Google, Facebook, Github etc.
   */
  async updateCredentials(
    credentials: UpdateCredentials
  ): Promise<CredentialsStateModel> {
    const response = await this.parentEntity
      .getHttpClient()
      .put<CredentialsStateModel>("/app/credentials", credentials, {
        headers: this.getHeaders(),
      });
    return response.data;
  }

  /**
   * Gets the states of the credentials checking whether they have been added or not.
   * This does NOT return the actual credentials
   * @returns Returns AppModel
   */
  async getCredentialsState(): Promise<CredentialsStateModel> {
    const response = await this.parentEntity
      .getHttpClient()
      .get<CredentialsStateModel>("/app/credentialsState", {
        headers: this.getHeaders(),
      });
    return response.data;
  }

  /**
   * Get the app template configuration for the whole app.
   * @param type TemplateName
   * @returns
   */
  async getEmailTemplate(
    type: TemplateName
  ): Promise<EmailTemplateResponseDto> {
    const data = await this._communicationClient._internalGetTemplate(type);
    return data;
  }

  /**
   * Changes the app template configuration for the whole app.
   * @param args UpdateEmailTemplateRequestDto
   * @returns 
   * 
   * # Content variables
   * Check TemplateVariables for available variables to use in content.

Overriding one of the pre defined templates can be done easily. When you override a template, Nblocks will use this content for all languages.
The HTML content supports variables that are injected when rendering the template. Except for the `ctaUrl` variable, which contains a unique link if the mail asks the user to perform an action, these are not required and can be considered just as helpers.

Usage: `<h1>{{variable}}</h1` to inject it in the content html.

| Variable           | Example                                              | Description                                                                       |
| ------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| appName            | `My app`                                             | Your app name                                                                     |
| appLogo            | `https://url-to-logo.png`                            | Your app logo url                                                                 |
| appUrl             | `https://url-to-app.com`                             | A url to your app frontend                                                        |
| emailTitle         | `Reset your password`                                | The title of the email. Comes from Nblocks standard texts                         |
| emailBody          | `To reset your password, please click the button...` | The content of the email. Comes from Nblocks standard texts                       |
| ctaTitle           | `Reset password`                                     | The Call-to-action button title. Comes from Nblocks standard texts                |
| ctaUrl             | `https://unique-link...`                             | The Call-to-action button link. A unique link relevant to this email              |
| fallBackButtonText | `Button not working? Click the li...`                | A title to a fallback link displayed under the CTA button for older email clients |
| currentYear        | `2023`                                               | Current year                                                                      |

   */
  async overrideEmailTemplate(
    args: UpdateEmailTemplateRequestDto
  ): Promise<EmailTemplateResponseDto> {
    const data = await this._communicationClient._internalOverrideTemplate(
      args
    );
    return data;
  }

  /**
   * Reset the app template configuration for the whole app.
   * @param type TemplateName
   * @returns
   */
  async resetEmailTemplate(type: TemplateName): Promise<void> {
    await this._communicationClient._internalResetTemplate(type);
  }

  /**
   * Deletes the whole app with its tenants and all its users. It also deletes all related data like credentials, connections, configs, files etc.
   */
  async deleteApp(): Promise<void> {
    await this.parentEntity
      .getHttpClient()
      .delete<void>("/app", {
        headers: this.getHeaders(),
      });
  }


    /**
   * Updates your `Custom Params config` for the `Tenant User` model. This adds new fields to the Tenant User model that will be available in the frontend during signup and profile update.
   * @param model Your custom params config model
   * @returns Returns AppModel
   */
    async updateTenantUserCustomParamsConfig(model: ParamConfig[]): Promise<CustomParamsConfig> {
      const response = await this.parentEntity
        .getHttpClient()
        .put<CustomParamsConfig>("/app/custom-tenant-user-params-config", model, { headers: this.getHeaders() });
      return response.data;
    }


     /**
   * Gets the states of the credentials checking whether they have been added or not.
   * This does NOT return the actual credentials
   * @returns Returns AppModel
   */
  async getTenantUserCustomParamsConfig(): Promise<CustomParamsConfig> {
    const response = await this.parentEntity
      .getHttpClient()
      .get<CustomParamsConfig>("/app/custom-tenant-user-params-config", {
        headers: this.getHeaders(),
      });
    return response.data;
  }

}
