import MockAdapter from 'axios-mock-adapter';
import * as unauthenticatedMock from '../../../test/unauthenticated-response.mock.json';
import * as authenticateMock from '../../../test/authenticate-response.mock.json';
import * as authenticatedMock from '../../../test/authenticated-response.mock.json';
import * as listMyUsersMock from '../../../test/list-my-tenant-users-response.mock.json';
import * as authorizeMock from '../../../test/authorize-response.mock.json';
import * as deauthenticateMock from '../../../test/deauthenticate-response.mock.json';
import { UnauthenticatedError } from '../../errors/UnauthenticatedError';
import { PlatformClient } from '../platform-client';

describe('Auth client', () => {
    let client: PlatformClient;
    
    let authToken: string;
    let tenantUserId: string;
    
    let mockApi: MockAdapter;
    beforeAll(() => {
        client = new PlatformClient("SECRET", 1, false, 'DEV');
        mockApi = new MockAdapter(client["httpClient"]);
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('Authenticate user with wrong credentials should throw UnauthenticatedError', async () => {
        mockApi.onPost("/auth/authenticate").reply(401, unauthenticatedMock);
        const promise = client.auth.authenticate({username: "WRONG", password: "password"}, "automated-test");
        await expect(promise).rejects.toThrowError(UnauthenticatedError);
    })

    test('Authenticate user', async () => {
        mockApi.onPost("/auth/authenticate").reply(200, authenticateMock);
        const response = await client.auth.authenticate({username: "CORRECT", password: "PASSWORD"}, "automated-test");
        expect(response.token).toBeDefined();
        expect(response.mfaState).toBeDefined();
        authToken = response.token;
    })

    test('User should be authenticated', async () => {
        mockApi.onPost("/auth/authenticated").reply(200, authenticatedMock);
        const response = await client.auth.authenticated(authToken);
        expect(response.authenticated).toBeTruthy();
    })

    test('List TenantUsers for session', async () => {
        mockApi.onPost("/auth/listMyTenantUsers").reply(200, listMyUsersMock);
        const response = await client.auth.listTenantUsers(authToken);
        expect(response.length).toBeGreaterThan(0);
        tenantUserId = response[0].id;
    })

    test('Update user data', async () => {
        mockApi.onPut("/auth/user").reply(200);
        await client.auth.updateUser({authToken, firstName: "John", lastName: "Doe", consentsToPrivacyPolicy: true});
    })

    test('Authorize TenantUser for USER_READ action', async () => {
        mockApi.onPost("/auth/authorize").reply(200, authorizeMock);
        const response = await client.auth.authorize(authToken, tenantUserId, 'USER_READ');
        expect(response.granted).toBeTruthy();
    })

    test('Deauthenticate user', async () => {
        mockApi.onPost("/auth/deauthenticate").reply(200, deauthenticateMock);
        const response = await client.auth.deauthenticate(authToken);
        expect(response.deauthenticated).toBeTruthy();
    })

    test('Request forgot password', async () => {
        mockApi.onPost("/auth/password").reply(200);
        await client.auth.forgotPassword("john@nebulr.group");
    })

    test('Commit new password', async () => {
        mockApi.onPut("/auth/password").reply(200);
        await client.auth.updatePassword({password: "PASSWORD", token: "SECRET"});
    })
})