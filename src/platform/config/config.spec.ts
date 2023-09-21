import * as appMock from '../../../test/app-response.mock.json'
import * as getTemplateMock from '../../../test/get-email-template-response.mock.json';
import * as updateTemplateMock from '../../../test/update-email-template-response.mock.json';
import * as listPlansMock from '../../../test/list-plans-response.mock.json';
import * as getPlanMock from '../../../test/get-plan-response.mock.json';
import * as listTaxesMock from '../../../test/list-taxes-response.mock.json';
import * as getTaxMock from '../../../test/get-tax-response.mock.json';
import MockAdapter from 'axios-mock-adapter';
import { Config } from './config';
import { NblocksClient } from '../nblocks-client';
import { AppModel } from '../models/app.model';

describe('Platform client', () => {

    let client: NblocksClient;
    let config: Config;
    let app: AppModel;
    let mockApi: MockAdapter;
    beforeAll(() => {
        client = new NblocksClient({appId: "id", apiKey: "SECRET", stage: 'DEV'});
        config = client.config;
        mockApi = new MockAdapter(client["httpClient"]);
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('Get app model', async () => {
        mockApi.onGet("/app").reply(200, appMock);

        const response = await config.getAppProfile();
        expect(response.id).toBeDefined();
        app = response;
    });

    test('Get app roles', async () => {
        mockApi.onGet("/app").reply(200, appMock);

        const response = await config.getAppRoleNames();
        expect(response.length).toBeGreaterThan(0);
    });

    test('Update app model', async () => {
        mockApi.onPut("/app").reply(200, {...appMock, ...{name: "Another name"}});
        const response = await config.updateAppProfile({
            name: "Another name"
        });
        expect(response.name).toBe("Another name");

        mockApi.onPut("/app").reply(200, {...appMock, ...{name: app.name}});
        const response2 = await config.updateAppProfile({
            name: app.name
        });
        expect(response2.name).toBe(app.name);
    });

    test('Update app credentials', async () => {
        mockApi.onPut("/app/credentials").reply(200);
        await config.updateCredentials({facebookAppId: "1", facebookAppSecret: "2"});
    });

    test('Get email template', async () => {
        mockApi.onGet("/template/SIGNUP").reply(200, getTemplateMock);
        const template = await config.getEmailTemplate('SIGNUP');
        expect(template.type).toBe("SIGNUP");
    });

    test('Update email template', async () => {
        mockApi.onPut("/template/SIGNUP").reply(200, updateTemplateMock);
        const template = await config.overrideEmailTemplate({type: 'SIGNUP', content: "<h1>Welcome</h1>"});
        expect(template.content).toBe("<h1>Welcome</h1>");
    });

    test('Reset email template', async () => {
        mockApi.onDelete("/template/SIGNUP").reply(200);
        await config.resetEmailTemplate('SIGNUP');
    });

    test('List plans', async () => {
        mockApi.onGet("payments/plan").reply(200, listPlansMock);
        const response = await config.listPlans();
        expect(response).toHaveLength(2);
    });

    test('Get plan', async () => {
        mockApi.onGet("payments/plan/plan_1234").reply(200, getPlanMock);
        const response = await config.getPlan("plan_1234");
        expect(response.id).toBeDefined();
    });

    test('Create plan', async () => {
        mockApi.onPost("payments/plan").reply(200, getPlanMock);
        const response = await config.createPlan({});
        expect(response.id).toBeDefined();
    });

    test('Update plan', async () => {
        mockApi.onPut("payments/plan/plan_1234").reply(200, getPlanMock);
        const response = await config.updatePlan("plan_1234", {});
        expect(response.id).toBeDefined();
    });

    test('Delete plan', async () => {
        mockApi.onDelete("payments/plan/plan_1234").reply(200);
        await config.deletePlan("plan_1234");
    });

    test('List taxes', async () => {
        mockApi.onGet("payments/tax").reply(200, listTaxesMock);
        const response = await config.listTaxes();
        expect(response).toHaveLength(1);
    });

    test('Get tax', async () => {
        mockApi.onGet("payments/tax/tax_1234").reply(200, getTaxMock);
        const response = await config.getTax("tax_1234");
        expect(response.id).toBeDefined();
    });

    test('Create tax', async () => {
        mockApi.onPost("payments/tax").reply(200, getTaxMock);
        const response = await config.createTax({countryCode: "SE", name: "Moms", percentage: 25});
        expect(response.id).toBeDefined();
    });

    test('Update tax', async () => {
        mockApi.onPut("payments/tax/tax_1234").reply(200, getTaxMock);
        const response = await config.updateTax("tax_1234", {percentage: 25});
        expect(response.id).toBeDefined();
    });

    test('Delete tax', async () => {
        mockApi.onDelete("payments/tax/tax_1234").reply(200);
        await config.deleteTax("tax_1234");
    });
})