import * as appMock from '../../../test/app-response.mock.json'
import * as getTemplateMock from '../../../test/get-email-template-response.mock.json';
import * as updateTemplateMock from '../../../test/update-email-template-response.mock.json';
import * as credentialsStateMock from '../../../test/credentials-state-response.mock.json';
import * as customParamsConfigMock from '../../../test/custom-params-config-response.mock.json';
import MockAdapter from 'axios-mock-adapter';
import { Config } from './config';
import { NblocksClient } from '../nblocks-client';
import { AppModel } from '../models/app.model';
import { CredentialsStateModel } from '../models/credentials-state.model';
import { ParamConfig, ParamType } from '../models/custom-params-config.model';

describe('Platform config client', () => {

    let client: NblocksClient;
    let config: Config;
    let app: AppModel;
    let mockApi: MockAdapter;
    let credentialsState: CredentialsStateModel;
    beforeAll(() => {
        client = new NblocksClient({appId: "app_123", apiKey: "SECRET", stage: 'DEV'});
        config = client.config;
        mockApi = new MockAdapter(client["httpClient"]);
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('Get app model', async () => {
        mockApi.onGet("/app").reply(200, appMock);

        const response = await config.getAppProfile();
        expect(response.id).toBeDefined();
        app = response;
    });

    test('Update app model', async () => {
        mockApi.onPut("/app").reply(200, {...appMock, ...{name: "Another name"}});
        const response = await config.updateAppProfile({
            name: "Another name"
        });
        expect(response.name).toBe("Another name");

        mockApi.onPut("/app").reply(200, {...appMock, ...{name: app.name}});
        const response2 = await config.updateAppProfile({
            name: app.name
        });
        expect(response2.name).toBe(app.name);
    });

    test("Get credentials added state", async () => {
        mockApi.onGet("/app/credentialsState").reply(200, credentialsStateMock);

        const response = await config.getCredentialsState();
        expect(response.stripeCredentialsAdded).toBeFalsy();
        credentialsState = response;
    });

    test('Update app credentials', async () => {
        mockApi.onPut("/app/credentials").reply(200, {...credentialsStateMock});
        await config.updateCredentials({stripePublicKey: "public", stripeSecretKey: "secret"});
    });

    test('Get email template', async () => {
        mockApi.onGet("/email/template/SIGNUP").reply(200, getTemplateMock);
        const template = await config.getEmailTemplate('SIGNUP');
        expect(template.type).toBe("SIGNUP");
    });

    test('Update email template', async () => {
        mockApi.onPut("/email/template/SIGNUP").reply(200, updateTemplateMock);
        const template = await config.overrideEmailTemplate({type: 'SIGNUP', content: "<h1>Welcome</h1>"});
        expect(template.content).toBe("<h1>Welcome</h1>");
    });

    test('Reset email template', async () => {
        mockApi.onDelete("/email/template/SIGNUP").reply(200);
        await config.resetEmailTemplate('SIGNUP');
    });

    test('Delete the whole app', async () => {
        mockApi.onDelete("/app").reply(200);
        await config.deleteApp();
    });

    test('Get tenant user custom params config', async () => {
        mockApi.onGet("/app/custom-tenant-user-params-config").reply(200, customParamsConfigMock);
        
        const response = await config.getTenantUserCustomParamsConfig();
        expect(response.params).toBeDefined();
    });

    test('Update tenant user custom params config', async () => {
        const updateParams: ParamConfig[] = [
            {                
                label: "Custom Field",
                type: ParamType.TEXT,                 
            }
        ];
        
        mockApi.onPut("/app/custom-tenant-user-params-config").reply(200, {
            params: updateParams
        });

        const response = await config.updateTenantUserCustomParamsConfig(updateParams);
        expect(response.params).toEqual(updateParams);
    });
})