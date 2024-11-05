import * as listMock from '../../../../test/list-federation-connections-response.mock.json';
import * as getMock from '../../../../test/get-federation-connection-response.mock.json';
import MockAdapter from 'axios-mock-adapter';
import { NblocksClient } from '../../nblocks-client';
import { Federation } from './federation';

describe('Federation connection client', () => {

    let client: NblocksClient;
    let federation: Federation;
    let mockApi: MockAdapter;
    beforeAll(() => {
        client = new NblocksClient({appId: "id", apiKey: "SECRET", stage: 'DEV'});
        federation = client.config.federation;
        mockApi = new MockAdapter(client["httpClient"]);
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('List', async () => {
        mockApi.onGet("federation/connection").reply(200, listMock);
        const response = await federation.list();
        expect(response).toHaveLength(2);
    });

    test('Get', async () => {
        mockApi.onGet("federation/connection/conn_1234").reply(200, getMock);
        const response = await federation.get("conn_1234");
        expect(response.id).toBeDefined();
    });

    test('Create', async () => {
        mockApi.onPost("federation/connection").reply(200, getMock);
        const response = await federation.create({
            type: "saml",
            name: "My connection 2",
            clientId: "client_1",
            loginUrl: "https://mocksaml.com/api/saml/sso",
            certificate: "MIIC4jCCAcoCCQC33wnybT5QZDANBgkqhkiG9w0BAQsFADAyMQswCQYDVQQGEwJVSzEPMA0GA1UECgwGQm94eUhRMRIwEAYDVQQDDAlNb2NrIFNBTUwwIBcNMjIwMjI4MjE0NjM4WhgPMzAyMTA3MDEyMTQ2MzhaMDIxCzAJBgNVBAYTAlVLMQ8wDQYDVQQKDAZCb3h5SFExEjAQBgNVBAMMCU1vY2sgU0FNTDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALGfYettMsct1T6tVUwTudNJH5Pnb9GGnkXi9Zw/e6x45DD0RuRONbFlJ2T4RjAE/uG+AjXxXQ8o2SZfb9+GgmCHuTJFNgHoZ1nFVXCmb/Hg8Hpd4vOAGXndixaReOiq3EH5XvpMjMkJ3+8+9VYMzMZOjkgQtAqO36eAFFfNKX7dTj3VpwLkvz6/KFCq8OAwY+AUi4eZm5J57D31GzjHwfjH9WTeX0MyndmnNB1qV75qQR3b2/W5sGHRv+9AarggJkF+ptUkXoLtVA51wcfYm6hILptpde5FQC8RWY1YrswBWAEZNfyrR4JeSweElNHg4NVOs4TwGjOPwWGqzTfgTlECAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAAYRlYflSXAWoZpFfwNiCQVE5d9zZ0DPzNdWhAybXcTyMf0z5mDf6FWBW5Gyoi9u3EMEDnzLcJNkwJAAc39Apa4I2/tml+Jy29dk8bTyX6m93ngmCgdLh5Za4khuU3AM3L63g7VexCuO7kwkjh/+LqdcIXsVGO6XDfu2QOs1Xpe9zIzLpwm/RNYeXUjbSj5ce/jekpAw7qyVVL4xOyh8AtUW1ek3wIw1MJvEgEPt0d16oshWJpoS1OT8Lr/22SvYEo3EmSGdTVGgk3x3s+A0qWAqTcyjr7Q4s/GKYRFfomGwz0TZ4Iw1ZN99Mm0eo2USlSRTVl7QHRTuiuSThHpLKQQ==",
            requestMethod: "GET",
            signedRequest: false,
        });
        expect(response.id).toBeDefined();
    });

    test('Update', async () => {
        mockApi.onPut("federation/connection/conn_1234").reply(200, getMock);
        const response = await federation.update("conn_1234", {
            name: "My connection 3"
        });
        expect(response.id).toBeDefined();
    });

    test('Delete', async () => {
        mockApi.onDelete("federation/connection/conn_1234").reply(200);
        await federation.delete("conn_1234");
    });
})