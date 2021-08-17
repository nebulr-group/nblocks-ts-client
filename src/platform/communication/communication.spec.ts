import { PlatformClient, Stage } from "../platform-client";
import * as testData from '../../../test/testData.json'

describe('Users client', () => {

    let client: PlatformClient;

    beforeAll(() => {
        client = new PlatformClient(testData.API_KEY, 1, true, testData.STAGE as Stage);
    });

    test('Send an email to anyone', async () => {
        await client.communicationClient.sendEmail({
            to: testData.USERNAME,
            emailTitle: "Hello from Jest test",
            emailBody: "This email was generated from a test"
        });
    })

    test('Send an sms to anyone', async () => {
        await client.communicationClient.sendSms({
            to: testData.PHONE,
            text: "Hello from Jest test"
        });
    })

    test('Send an sms OTP to anyone', async () => {
        const result = await client.communicationClient.sendOtpSms({
            to: testData.PHONE,
            locale: 'en'
        });
        expect(result.code.length).toBeGreaterThan(3);
    })
})