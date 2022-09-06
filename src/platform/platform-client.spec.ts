import * as appMock from '../../test/app-response.mock.json'
import { AppModel } from './models/app.model';
import { PlatformClient } from './platform-client';
import MockAdapter from 'axios-mock-adapter';

describe('Platform client', () => {

    let client: PlatformClient;
    let app: AppModel;
    let mockApi: MockAdapter;
    beforeAll(() => {
        client = new PlatformClient("SECRET", 1, false, 'DEV');
        mockApi = new MockAdapter(client["httpClient"]);
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('Get app model', async () => {
        mockApi.onGet("/app").reply(200, appMock);

        const response = await client.getApp();
        expect(response.id).toBeDefined();
        app = response;
    });

    test('Get app roles', async () => {
        mockApi.onGet("/app").reply(200, appMock);

        const response = await client.getAppRoleNames();
        expect(response.length).toBeGreaterThan(0);
    });

    test('Update app model', async () => {
        mockApi.onPut("/app").reply(200, {...appMock, ...{name: "Another name"}});
        const response = await client.updateApp({
            name: "Another name"
        });
        expect(response.name).toBe("Another name");

        mockApi.onPut("/app").reply(200, {...appMock, ...{name: app.name}});
        const response2 = await client.updateApp({
            name: app.name
        });
        expect(response2.name).toBe(app.name);
    });

    test('Update app credentials', async () => {
        mockApi.onPut("/app/credentials").reply(200);
        await client.updateAppCredentials({facebookAppId: "1", facebookAppSecret: "2"});
    });
})