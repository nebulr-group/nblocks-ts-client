import MockAdapter from 'axios-mock-adapter';
import * as listTenantsMock from '../../../test/list-tenants-response.mock.json';
import * as createTenantsMock from '../../../test/create-tenant-response.mock.json';
import * as tenantMock from '../../../test/tenant-response.mock.json';
import * as tenantPaymentDetailsMock from '../../../test/get-tenant-payment-details.mock.json';
import * as translateMock from '../../../test/translate-response.mock.json';
import * as customerPortalMock from '../../../test/customer-portal-response.mock.json';
import * as CheckoutSessionMock from '../../../test/checkout-session-response.mock.json';
import * as validateImportMock from '../../../test/validate-import-tenant-from-file-response.mock.json';
import * as importMock from '../../../test/import-tenant-from-file-response.mock.json';
import * as importStatusMock from '../../../test/import-status-response.mock.json';
import { NblocksClient } from '../nblocks-client';

describe('Tenant client', () => {

    let client: NblocksClient;
    let newTenantId: string;

    let mockApi: MockAdapter;
    beforeAll(() => {
        client = new NblocksClient({appId: "id", apiKey: "SECRET", stage: 'DEV'});
        mockApi = new MockAdapter(client["httpClient"]);
    });

    beforeEach(() => {
        mockApi.reset();
    });

    // Generic calls without ID -------------------------------------------------
    
    test('List tenants', async () => {
        mockApi.onGet("/tenant").reply(200, listTenantsMock);
        const response = await client.tenants.list();
        expect(response.length).toBeGreaterThan(0);
    });

    test('Create a tenant', async () => {
        mockApi.onPost("/tenant").reply(200, createTenantsMock);
        const response = await client.tenants.create({
            name: "New Company Ltd",
            plan: "TEAM",
            owner: {email: "john@example.com", firstName: "John", lastName: "Doe"},
            metadata: {
                VIP: "true"
            }
        });
        expect(response.id).toBeDefined();
        expect(response.metadata!["VIP"]).toBeTruthy();
        expect(response.name).toBe("New Company Ltd");
        newTenantId = response.id;
    });

    // Calls with ID -------------------------------------------------

    // test('Delete the tenant just created', async () => {
    //     const response = await client.tenant(newTenantId).delete();
    // });

    test('Get tenant model', async () => {
        mockApi.onGet(`/tenant/byId/${newTenantId}`).reply(200, tenantMock);
        const response = await client.tenant(newTenantId).get();
        expect(response.id).toBeDefined;
    });

    test('Update a tenants logo and locale', async () => {
        mockApi.onPut(`/tenant/${newTenantId}`).reply(200, tenantMock);
        const response = await client.tenant(newTenantId).update({
             logo: "http://path/to/logo.png",
             locale: 'en'
        });
        expect(response.id).toBeDefined();
    });

    test('Get tenant payment details', async () => {
        mockApi.onGet(`/tenant/${newTenantId}/paymentDetails`).reply(200, tenantPaymentDetailsMock);
        const response = await client.tenant(newTenantId).getPaymentDetails();
        expect(response.status.shouldSelectPlan).toBeDefined();
        expect(response.status.shouldSetupPayments).toBeDefined();
        expect(response.status.paymentsEnabled).toBeDefined();
        expect(response.status.provider).toBeDefined();
        expect(response.details.plan).toBeDefined();
        expect(response.details.price).toBeDefined();
        expect(response.details.trial).toBeDefined();
        expect(response.details.trialDaysLeft).toBeDefined();
    });

    test('Set tenant plan details', async () => {
        mockApi.onPost(`/tenant/${newTenantId}/planDetails`).reply(200, tenantPaymentDetailsMock);
        const response = await client.tenant(newTenantId).setPlanDetails({
            planKey: "premium",
            priceOffer: {
                "currency": "EUR",
                "recurrenceInterval": "month"
            }
        });
        expect(response.status.shouldSelectPlan).toBeDefined();
        expect(response.status.shouldSetupPayments).toBeDefined();
        expect(response.details.plan).toBeDefined();
        expect(response.details.price).toBeDefined();
        expect(response.details.trial).toBeDefined();
        expect(response.details.trialDaysLeft).toBeDefined();
    });

    test('Generate stripe checkout session', async () => {
        mockApi.onPost(`/app/checkoutId`).reply(200, CheckoutSessionMock);
        const response = await client.tenants.createStripeCheckoutSession({
            planKey: "TEAM", priceOffer: {currency: "USD", recurrenceInterval: "month"}
        });
        expect(response.id).toBeDefined();
        expect(response.publicKey).toBeDefined();
    });

    test('Generate stripe checkout session for a specific tenant', async () => {
        mockApi.onPost(`/tenant/${newTenantId}/checkoutId`).reply(200, CheckoutSessionMock);
        const response = await client.tenant(newTenantId).createStripeCheckoutSession();
        expect(response.id).toBeDefined();
        expect(response.publicKey).toBeDefined();
    });

    test('Get Customer Portal Url', async () => {
        mockApi.onGet(`/tenant/${newTenantId}/customerPortal`).reply(200, customerPortalMock);
        const response = await client.tenant(newTenantId).getSubscriptionPortalUrl();
        expect(response.url).toBeDefined();
    });
    
    test('Translate text to Tenant language', async () => {
        mockApi.onPost(`/tenant/translate/text`).reply(200, translateMock);
        const response = await client.tenant(newTenantId).translateText({
            sourceLanguage: 'sv',
            text: "How old are you?"
        });
        expect(response.translatedText).toBe("Hur gammal är du?");
    });

    test('Validate import data', async () => {
        mockApi.onPost(`/import/validateTenantsFromFile`).reply(200, validateImportMock);
        const response = await client.tenants.validateImportFromFile({fileUrl: "http://path/to/file.csv"});
        expect(response).toBeDefined();
        expect(response.approved).toBeFalsy();
    });

    test('Import', async () => {
        mockApi.onPost(`import/tenantsFromFile`).reply(200, importMock);
        const response = await client.tenants.importFromFile({fileUrl: "http://path/to/file.csv"});
        expect(response).toBeDefined();
        expect(response.status).toBeDefined();
        expect(response.import).toBeDefined();
    });

    test('Check import status', async () => {
        const reference = "624c14cc0c01e7003335628f";
        mockApi.onGet(`/import/status/${reference}`).reply(200, importStatusMock);
        const response = await client.tenants.checkImportStatus(reference);
        expect(response).toBeDefined();
        expect(response.status).toBeDefined();
    });

    test('Delete the whole tenant', async () => {
        mockApi.onDelete(`/tenant/${newTenantId}`).reply(200);
        await client.tenant(newTenantId).delete();
    });
})