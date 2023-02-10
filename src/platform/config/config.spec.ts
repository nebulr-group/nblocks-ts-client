import * as appMock from '../../../test/app-response.mock.json'
import * as getTemplateMock from '../../../test/get-email-template-response.mock.json';
import * as updateTemplateMock from '../../../test/update-email-template-response.mock.json';
import MockAdapter from 'axios-mock-adapter';
import { Config } from './config';
import { NblocksClient } from '../nblocks-client';
import { AppModel } from '../models/app.model';

describe('Platform client', () => {

    let client: NblocksClient;
    let config: Config;
    let app: AppModel;
    let mockApi: MockAdapter;
    beforeAll(() => {
        client = new NblocksClient("SECRET", 1, false, 'DEV');
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

    test('Get app roles', async () => {
        mockApi.onGet("/app").reply(200, appMock);

        const response = await config.getAppRoleNames();
        expect(response.length).toBeGreaterThan(0);
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

    test('Update app credentials', async () => {
        mockApi.onPut("/app/credentials").reply(200);
        await config.updateCredentials({facebookAppId: "1", facebookAppSecret: "2"});
    });

    test('Get email template', async () => {
        mockApi.onGet("/template/SIGNUP").reply(200, getTemplateMock);
        const template = await config.getEmailTemplate('SIGNUP');
        expect(template.type).toBe("SIGNUP");
    });

    test('Update email template', async () => {
        mockApi.onPut("/template/SIGNUP").reply(200, updateTemplateMock);
        const template = await config.overrideEmailTemplate('SIGNUP', "<h1>Welcome</h1>");
        expect(template.content).toBe("<h1>Welcome</h1>");
    });

    test('Reset email template', async () => {
        mockApi.onDelete("/template/SIGNUP").reply(200);
        await config.resetEmailTemplate('SIGNUP');
    });
})