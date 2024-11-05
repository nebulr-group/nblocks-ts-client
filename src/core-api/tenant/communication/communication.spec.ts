import * as createRuleMock from '../../../../test/create-redirect-rule-response.mock.json';
import * as listRulesMock from '../../../../test/list-redirect-rules-response.mock.json';
import * as updateRuleMock from '../../../../test/update-redirect-rule-response.mock.json';
import * as listRuleErrorsMock from '../../../../test/list-redirect-rule-errors-response.mock.json';
import { CommunicationClient } from "./communication";
import { RedirectRuleDto } from "./models/redirect-rule.dto";
import MockAdapter from "axios-mock-adapter";
import { NblocksClient } from "../../nblocks-client";

describe('Communcation client', () => {

    let comClient: CommunicationClient;

    let redirectRule:RedirectRuleDto;

    let mockApi: MockAdapter;
    beforeAll(() => {
        const client = new NblocksClient({appId: "id", apiKey: "SECRET", stage: 'DEV'});
        mockApi = new MockAdapter(client["httpClient"]);
        comClient = client.tenant("1234").communicationClient
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('Create redirect rule', async () => {
        mockApi.onPost("/voice/redirectRule").reply(200, createRuleMock);
        const rule = await comClient.createVoiceRedirectRule(
            {
                anonymous: true,
                phoneNumber: "+4612345678",
                targets: [
                    {
                        "phoneNumber": "+46987654321",
                        "available": true
                    }
                ],
            }
        );
        redirectRule = rule;
        expect(rule).toBeDefined();
    });

    test('List redirect rules', async () => {
        mockApi.onGet("/voice/redirectRule").reply(200, listRulesMock);
        const rules = await comClient.listVoiceRedirectRules();
        expect(rules.length).toBeGreaterThanOrEqual(1);
    });
    
    test('List redirect rule errors', async () => {
        mockApi.onGet(`/voice/redirectRule/errors/${redirectRule.id!}/3`).reply(200, listRuleErrorsMock);
        const errors = await comClient.listVoiceRedirectErrors(redirectRule.id!, 3);
        expect(errors).toBeDefined();
    });

    test('Update redirect rule', async () => {
        mockApi.onPut("/voice/redirectRule").reply(200, updateRuleMock);
        redirectRule.targets.push({
            available: true,
            name: "Oscar",
            phoneNumber: "+123456"
        })
        const rule = await comClient.updateVoiceRedirectRule(redirectRule);
        expect(rule).toBeDefined();
        expect(rule.targets).toHaveLength(2);
    });

    test('Delete redirect rule', async () => {
        mockApi.onDelete(`/voice/redirectRule/${redirectRule.id}`).reply(200);
        await comClient.deleteVoiceRedirectRule(redirectRule.id!);
    });

    test('Send an email to anyone', async () => {
        mockApi.onPost(`/email/send`).reply(200);
        await comClient.sendEmail({
            to: "john@doe.com",
            emailTitle: "Hello from Jest test",
            emailBody: "This email was generated from a test",
            ctaTitle: "Click here",
            ctaUrl: "https://google.com"
        });
    })

    test('Expect use an internal call to throw error', async () => {
        const promise = comClient._internalGetTemplate('INVITE_EXISTING');
        await expect(promise).rejects.toThrowError(Error);
    })

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