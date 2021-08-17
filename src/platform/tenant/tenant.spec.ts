import * as testData from '../../../test/testData.json'
import { PlatformClient, Stage } from '../platform-client';

describe('Tenant client', () => {

    let client: PlatformClient;
    let newTenantId: string;
    beforeAll(() => {
        client = new PlatformClient(testData.API_KEY, 1, true, testData.STAGE as Stage);
    });

    // Generic calls without ID -------------------------------------------------
    
    test('List tenants', async () => {
        const response = await client.tenants.list();
        expect(response.length).toBeGreaterThan(0);
    });

    // Reactivate as soon as we can remove tenants
    // test('Create a tenant', async () => {
    //     const response = await client.tenants.create({
    //         name: "Platform TS Lib test",
    //         plan: "TEAM",
    //         email: "john.doe@example.com",
    //         metadata: {
    //             deleteMe: "true"
    //         }
    //     });
    //     expect(response.id).toBeDefined();
    //     expect(response.metadata["deleteMe"]).toBe("true");
    //     expect(response.name).toBe("Platform TS Lib test");
    //     newTenantId = response.id;
    // });

    // Calls with ID -------------------------------------------------

    // test('Delete the tenant just created', async () => {
    //     const response = await client.tenant(newTenantId).delete();
    // });

    test('Get tenant model', async () => {
        const response = await client.tenant(testData.TENANT).get();
        expect(response.id).toBe(testData.TENANT);
    });

    test('Update a tenants logo and locale', async () => {
        const logo = new Date().toISOString();
        const response = await client.tenant(testData.TENANT).update({
             logo, locale: 'en'
        });
        expect(response.logo).toBe(logo);
    });

    test('Translate text to Tenant language', async () => {
        const text = "Hur gammal är du?"
        const response = await client.tenant(testData.TENANT).translateText({
            sourceLanguage: 'sv',
            text
        });
        expect(response.translatedText).toBe("How old are you?");
    });

    // test('Get Customer Portal Url', async () => {
    //     const response = await client.tenant(testData.TENANT).getStripeCustomerPortalUrl();
    //     expect(response.url).toBeDefined();
    // });
})