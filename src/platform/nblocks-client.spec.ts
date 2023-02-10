import { NblocksClient } from './nblocks-client';

describe('Platform client', () => {

    let client: NblocksClient;

    beforeAll(() => {
        client = new NblocksClient("SECRET", 1, false, 'DEV');
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
        expect(client.config).toBeDefined();
        expect(client.tenant).toBeDefined();
        expect(client.tenants).toBeDefined();
    });
})