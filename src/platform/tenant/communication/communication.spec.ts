import { PlatformClient, Stage } from "../../platform-client";
import * as testData from '../../../../test/testData.json'
import { CommunicationClient } from "./communication";
import { RedirectRuleDto } from "./models/redirect-rule.dto";

describe('Communcation client', () => {

    let client: CommunicationClient;

    let redirectRule:RedirectRuleDto;

    beforeAll(() => {
        client = new PlatformClient(testData.API_KEY, 1, true, testData.STAGE as Stage).tenant(testData.TENANT).communicationClient;
    });

    test('Create redirect rule', async () => {
        const rule = await client.createVoiceRedirectRule(
            {
                anonymous: true,
                phoneNumber: "+4612345678",
                targets: [],
            }
        );
        redirectRule = rule;
        expect(rule).toBeDefined();
    });

    test('List redirect rules', async () => {
        const rules = await client.listVoiceRedirectRules();
        expect(rules.length).toBeGreaterThanOrEqual(1);
    });

    test('Update redirect rule', async () => {
        redirectRule.targets.push({
            available: true,
            phoneNumber: "+123456"
        })
        const rule = await client.updateVoiceRedirectRule(redirectRule);
        expect(rule).toBeDefined();
        expect(rule.targets).toHaveLength(1);
    });

    test('Delete redirect rule', async () => {
        await client.deleteVoiceRedirectRule(redirectRule.id);
    });

    // test('Send an email to anyone', async () => {
    //     await client.communicationClient.sendEmail({
    //         to: testData.USERNAME,
    //         emailTitle: "Hello from Jest test",
    //         emailBody: "This email was generated from a test"
    //     });
    // })

    // test('Send an sms to anyone', async () => {
    //     await client.communicationClient.sendSms({
    //         to: testData.PHONE,
    //         text: "Hello from Jest test"
    //     });
    // })

    // test('Send an sms OTP to anyone', async () => {
    //     const result = await client.communicationClient.sendOtpSms({
    //         to: testData.PHONE,
    //         locale: 'en'
    //     });
    //     expect(result.code.length).toBeGreaterThan(3);
    // })
})