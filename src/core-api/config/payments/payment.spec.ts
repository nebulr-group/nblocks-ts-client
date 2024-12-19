import * as listPlansMock from '../../../../test/list-plans-response.mock.json';
import * as getPlanMock from '../../../../test/get-plan-response.mock.json';
import * as listTaxesMock from '../../../../test/list-taxes-response.mock.json';
import * as getTaxMock from '../../../../test/get-tax-response.mock.json';
import MockAdapter from 'axios-mock-adapter';
import { NblocksClient } from '../../nblocks-client';
import { AppModel } from '../../models/app.model';
import { Payments } from './payments';

describe('Platform payments client', () => {

    let client: NblocksClient;
    let payments: Payments;
    let app: AppModel;
    let mockApi: MockAdapter;
    beforeAll(() => {
        client = new NblocksClient({appId: "id", apiKey: "SECRET", stage: 'DEV'});
        payments = client.config.payments;
        mockApi = new MockAdapter(client["httpClient"]);
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('List plans', async () => {
        mockApi.onGet("payments/plan").reply(200, listPlansMock);
        const response = await payments.listPlans();
        console.log(response);
        expect(response).toHaveLength(2);
    });

    test('Get plan', async () => {
        mockApi.onGet("payments/plan/plan_1234").reply(200, getPlanMock);
        const response = await payments.getPlan("plan_1234");
        expect(response.id).toBeDefined();
    });

    test('Create plan', async () => {
        mockApi.onPost("payments/plan").reply(200, getPlanMock);
        const response = await payments.createPlan({});
        expect(response.id).toBeDefined();
    });

    test('Update plan', async () => {
        mockApi.onPut("payments/plan/plan_1234").reply(200, getPlanMock);
        const response = await payments.updatePlan("plan_1234", {});
        expect(response.id).toBeDefined();
    });

    test('Delete plan', async () => {
        mockApi.onDelete("payments/plan/plan_1234").reply(200);
        await payments.deletePlan("plan_1234");
    });

    test('List taxes', async () => {
        mockApi.onGet("payments/tax").reply(200, listTaxesMock);
        const response = await payments.listTaxes();
        expect(response).toHaveLength(1);
    });

    test('Get tax', async () => {
        mockApi.onGet("payments/tax/tax_1234").reply(200, getTaxMock);
        const response = await payments.getTax("tax_1234");
        expect(response.id).toBeDefined();
    });

    test('Create tax', async () => {
        mockApi.onPost("payments/tax").reply(200, getTaxMock);
        const response = await payments.createTax({countryCode: "SE", name: "Moms", percentage: 25});
        expect(response.id).toBeDefined();
    });

    test('Update tax', async () => {
        mockApi.onPut("payments/tax/tax_1234").reply(200, getTaxMock);
        const response = await payments.updateTax("tax_1234", {percentage: 25});
        expect(response.id).toBeDefined();
    });

    test('Delete tax', async () => {
        mockApi.onDelete("payments/tax/tax_1234").reply(200);
        await payments.deleteTax("tax_1234");
    });
})