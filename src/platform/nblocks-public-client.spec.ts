import { NblocksPublicClient } from './nblocks-public-client';

describe('NblocksPublicClient', () => {

    let client: NblocksPublicClient;

    beforeAll(() => {
        client = new NblocksPublicClient("1234", {stage: 'DEV'});
    });

    test('Expect variables to be in place', async () => {
        expect(client.stage).toBe('DEV');
        expect(client.version).toBe(1);
        expect(client['appId']).toBe("1234");
    });

    test('Expect sub clients to be instantiated', async () => {
        expect(client.auth).toBeDefined();
    });
})