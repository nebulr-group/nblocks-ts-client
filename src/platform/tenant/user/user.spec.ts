import { NblocksClient } from "../../nblocks-client";
import * as listTenantUsersData from '../../../../test/list-tenant-users-response.mock.json';
import * as createUserMock from '../../../../test/create-tenant-user-response.mock.json';
import * as updateUserMock from '../../../../test/update-teant-user-response.mock.json';
import * as getUserMock from '../../../../test/get-tenant-user-response.mock.json';
import MockAdapter from "axios-mock-adapter";

describe('Users client', () => {

    let client: NblocksClient;
    let newUserId: string;
    
    let mockApi: MockAdapter;
    beforeAll(() => {
        client = new NblocksClient({appId: "id", apiKey: "SECRET", stage: 'DEV'});
        mockApi = new MockAdapter(client["httpClient"]);
    });

    beforeEach(() => {
        mockApi.reset();
    });

    // Generic calls without ID -------------------------------------------------
    
    test('List all users for a tenant', async () => {
        mockApi.onGet("/tenant/user").reply(200, listTenantUsersData);
        const response = await client.tenant("12345").users.list();
        expect(response.length).toBeGreaterThan(0);
    })

    test('Create a user', async () => {
        mockApi.onPost("/tenant/user").reply(200, createUserMock);
        const response = await client.tenant("12345").users.create({
            username: "john.doe@gmail.com",
            role: "ADMIN",
        });
        expect(response.email).toBe("john.doe@gmail.com");
        newUserId = response.id;
    })

    // Calls with ID -------------------------------------------------
    
    test('Get user', async () => {
        mockApi.onGet(`/tenant/user/${newUserId}`).reply(200, getUserMock);
        const response = await client.tenant("1234").user(newUserId).get();
        expect(response.role).toBe("OWNER");
    })

    test('Update a user', async () => {
        mockApi.onPut(`/tenant/user/${newUserId}`).reply(200, updateUserMock);
        const response = await client.tenant("1234").user(newUserId).update(
            {
                "role": "MANAGER",
                "teams": ["cool_gang"]
            }
        );
        expect(response.role).toBe("MANAGER");
    })

    test('Send an email to a user', async () => {
        mockApi.onPost(`/tenant/user/${newUserId}/email`).reply(200);
        await client.tenant("1234").user(newUserId).sendEmail({
            subject: "Hello from Jest test",
            emailBody: "This email was generated from a test"
        });
    })

    test('Send an sms to a user', async () => {
        mockApi.onPost(`/tenant/user/${newUserId}/sms`).reply(200);
        await client.tenant("1234").user(newUserId).sendSms({
            text: "Hello from tests"
        });
    })

    test('Send an sms OTP to a user', async () => {
        mockApi.onPost(`/tenant/user/${newUserId}/smsOtp`).reply(200);
        await client.tenant("1234").user(newUserId).sendOtpSms();
    })

    test('Send reset password link to a user', async () => {
        mockApi.onPost(`/tenant/user/${newUserId}/password`).reply(200);
        await client.tenant("1234").user(newUserId).resetPassword();
    })

    test('Delete the user just created', async () => {
        mockApi.onDelete(`/tenant/user/${newUserId}`).reply(200, createUserMock);
        await client.tenant("12345").user(newUserId).delete();
    })
})