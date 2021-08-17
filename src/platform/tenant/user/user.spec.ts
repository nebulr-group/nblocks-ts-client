import { PlatformClient, Stage } from "../../platform-client";
import * as testData from '../../../../test/testData.json'

describe('Users client', () => {

    let client: PlatformClient;
    let newUserId: string;
    beforeAll(() => {
        client = new PlatformClient(testData.API_KEY, 1, true, testData.STAGE as Stage);
    });

    // Generic calls without ID -------------------------------------------------
    
    test('List all users for a tenant', async () => {
        const response = await client.tenant(testData.TENANT).users.list();
        expect(response.length).toBeGreaterThan(0);
    })

    test('Create a user', async () => {
        const response = await client.tenant(testData.TENANT).users.create({
            username: "john+test@example.com",
            role: "ADMIN",
        });
        expect(response.email).toBe("john+test@example.com");
    })

    // Calls with ID -------------------------------------------------

    test('Delete the user just created', async () => {
        await client.tenant(testData.TENANT).user(newUserId).delete();
    })
    
    test('Update a user', async () => {
        const response = await client.tenant(testData.TENANT).user(testData.USER).update({
            enabled: false
        });
        expect(response.enabled).toBeFalsy();
        const response2 = await client.tenant(testData.TENANT).user(testData.USER).update({
            enabled: true
        });
        expect(response2.enabled).toBeTruthy();
    })

    test('Send an email to a user', async () => {
        await client.tenant(testData.TENANT).user(testData.USER).sendEmail({
            subject: "Hello from Jest test",
            emailBody: "This email was generated from a test"
        });
    })

    test('Send an sms to a user', async () => {
        await client.tenant(testData.TENANT).user(testData.USER).sendSms({
            text: "Hello from tests"
        });
    })

    test('Send an sms OTP to a user', async () => {
        await client.tenant(testData.TENANT).user(testData.USER).sendOtpSms();
    })

    test('Send reset password link to a user', async () => {
        await client.tenant(testData.TENANT).user(testData.USER).resetPassword();
    })
})