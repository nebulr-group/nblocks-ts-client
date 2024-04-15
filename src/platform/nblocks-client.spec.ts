import { NblocksClient } from './nblocks-client';

describe('NblocksClient', () => {

    let client: NblocksClient;

    beforeAll(() => {
        client = new NblocksClient({appId: "id", apiKey: "SECRET", stage: 'DEV'});
        client.setJwt("JWT");
    });

    test('Expect variables to be in place', async () => {
        expect(client.stage).toBe('DEV');
        expect(client.version).toBe(1);
        expect(client['apiKey']).toBe("SECRET");
        expect(client['jwt']).toBe("JWT");
    });

    test('Expect sub clients to be instantiated', async () => {
        expect(client.authLegacy).toBeDefined();
        expect(client.auth).toBeDefined();
        expect(client.auth.contextHelper).toBeDefined();
        expect(client.config).toBeDefined();
        expect(client.config.access).toBeDefined();
        expect(client.config.payments).toBeDefined();
        expect(client.config.federation).toBeDefined();
        expect(client.tenant).toBeDefined();
        expect(client.tenants).toBeDefined();
        expect(client.flag).toBeDefined();
    });
})