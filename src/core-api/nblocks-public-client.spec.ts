import { NblocksPublicClient } from './nblocks-public-client';

describe('NblocksPublicClient', () => {

    let client: NblocksPublicClient;

    beforeAll(() => {
        client = new NblocksPublicClient({appId: "app_123", stage: 'DEV'});
    });

    test('Expect variables to be in place', async () => {
        expect(client.stage).toBe('DEV');
        expect(client.version).toBe(1);
        expect(client.id).toBe("app_123");
    });

    test('Expect sub clients to be instantiated', async () => {
        expect(client.auth).toBeDefined();
        expect(client.auth.contextHelper).toBeDefined();
        expect(client.portal).toBeDefined();
        expect(client.flag).toBeDefined();
    });
    
})