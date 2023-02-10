import { Entity } from "../../abstracts/generic-entity";
import { AppModel } from "../models/app.model";
import { UpdateCredentials } from "../models/update-credentials-request.dto";
import { NblocksClient } from "../nblocks-client";
import { CommunicationClient } from "../tenant/communication/communication";
import { EmailTemplateResponseDto } from "../tenant/communication/models/get-email-template-response.dto";
import { TemplateName } from "../tenant/communication/models/template-name.type";

/**
 * Here we collect everything you can configure for your app in nblocks. These configurations is on the app level.
 */
export class Config extends Entity {

  private readonly _communicationClient: CommunicationClient;

  constructor(client: NblocksClient, debug?: boolean) {
    super(client, debug)
    this._communicationClient = new CommunicationClient(client, debug);
  }

   /**
   * Gets the complete `App` model of your app.
   * The app is your top most entity and holds all configurations for how your App interacts with the platform in any sub call. 
   * Use this response data to alter your model and push back
   * @returns Returns AppModel
   */
   async getAppProfile(): Promise<AppModel> {
    const response = await this.parentEntity.getHttpClient().get<AppModel>('/app', { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Shortcut to get the name of all your roles
   * @returns Returns a list of role names
   */
  async getAppRoleNames(): Promise<string[]> {
    this._log("listRoles");
    const app = await this.getAppProfile();
    return Object.keys(app.roles);
  }

  /**
   * Updates your `App` model. 
   * * Setting the emailSenderEmail will trigger a verification email to be sent to the email address provided. Once verified all Nblocks emails will be send through this address.
   * * Altering your Business model will trigger a synchronization with your Stripe account (if credentials are setup)
   * @param model Your app model
   * @returns Returns AppModel
   */
  async updateAppProfile(model: Partial<Omit<AppModel, "id" | "domain" | "stripeEnabled">>): Promise<AppModel> {
    const response = await this.parentEntity.getHttpClient().put<AppModel>('/app', model, { headers: this.getHeaders() });
    return response.data;
  }

  /**
   * Store sensitive credentials for your app so NBlocks can authorize with 3d party services on your behalf.
   * These credentials are never outputted back again
   * 
   * E.g. Stripe integration, social login providers like Google, Facebook, Github etc.
   */
  async updateCredentials(credentials: UpdateCredentials): Promise<void> {
    await this.parentEntity.getHttpClient().put<void>('/app/credentials', credentials, { headers: this.getHeaders() });
  }

  /**
   * Get the app template configuration for the whole app.
   * @param type TemplateName
   * @returns 
   */
  async getEmailTemplate(
    type: TemplateName
  ): Promise<EmailTemplateResponseDto> {
    const data = await this._communicationClient.getTemplate(type);
    return data;
  }

  /**
   * Changes the app template configuration for the whole app.
   * @param type TemplateName
   * @param content The html content
   * @returns 
   */
  async overrideEmailTemplate(
    type: TemplateName,
    content: string
  ): Promise<EmailTemplateResponseDto> {
    const data = await this._communicationClient.overrideTemplate(
      type,
      content
    );
    return data;
  }

  /**
   * Reset the app template configuration for the whole app.
   * @param type TemplateName
   * @returns 
   */
  async resetEmailTemplate(type: TemplateName): Promise<void> {
    await this._communicationClient.resetTemplate(type);
  }
}
