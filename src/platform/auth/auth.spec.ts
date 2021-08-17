import * as testData from '../../../test/testData.json';
import { UnauthenticatedError } from '../../errors/UnauthenticatedError';
import { PlatformClient, Stage } from '../platform-client';

describe('Auth client', () => {
    let client: PlatformClient;
    
    let authToken: string;
    let tenantUserId: string;
    
    beforeAll(() => {
        client = new PlatformClient(testData.API_KEY, 1, false, testData.STAGE as Stage);
    });

    test('Authenticate user with wrong credentials should throw UnauthenticatedError', async () => {
        const promise = client.auth.authenticate({username: testData.USERNAME, password: "password"}, "automated-test");
        expect(promise).rejects.toThrowError(UnauthenticatedError);
    })

    test('Authenticate user', async () => {
        const response = await client.auth.authenticate({username: testData.USERNAME, password: testData.PASSWORD}, "automated-test");
        expect(response.token).toBeDefined();
        authToken = response.token;
    })

    test('User should be authenticated', async () => {
        const response = await client.auth.authenticated(authToken);
        expect(response.authenticated).toBeTruthy();
    })

    test('Update user data', async () => {
        await client.auth.updateMe({authToken, firstName: "John", lastName: "Doe"});
    })

    test('List TenantUsers for session', async () => {
        const response = await client.auth.listMyTenantUsers(authToken);
        expect(response.length).toBeGreaterThan(0);
        tenantUserId = response[0].id;
    })

    test('Authorize TenantUser for USER_READ action', async () => {
        const response = await client.auth.authorize(authToken, tenantUserId, 'USER_READ');
        expect(response.granted).toBeTruthy();
    })

    test('Deauthenticate user', async () => {
        await client.auth.deauthenticate(authToken);
        const response = await client.auth.authenticated(authToken);
        expect(response.authenticated).toBeFalsy();
    })

    test('Request forgot password', async () => {
        expect(false).toBeTruthy();
    })

    test('Commit new password', async () => {
        expect(false).toBeTruthy();
    })
})