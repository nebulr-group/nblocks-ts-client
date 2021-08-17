import * as testData from '../../test/testData.json'
import { AppModel } from './models/app.model';
import { PlatformClient, Stage } from './platform-client';

describe('Platform client', () => {

    let client: PlatformClient;
    let app: AppModel;
    beforeAll(() => {
        client = new PlatformClient(testData.API_KEY, 1, true, testData.STAGE as Stage);
    });

    test('Get app model', async () => {
        const response = await client.getApp();
        expect(response.id).toBeDefined();
        app = response;
    });

    test('Get app roles', async () => {
        const response = await client.getAppRoleNames();
        expect(response.length).toBeGreaterThan(0);
    });

    test('Update app model', async () => {
        const response = await client.updateApp({
            name: "Another name"
        });
        expect(response.name).toBe("Another name");
        const response2 = await client.updateApp({
            name: app.name
        });
        expect(response2.name).toBe(app.name);
    });
})