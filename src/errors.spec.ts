import MockAdapter from 'axios-mock-adapter';
import { UnauthenticatedError } from './errors/UnauthenticatedError';
import { ForbiddenError } from './errors/ForbiddenError';
import { NotFoundError } from './errors/NotFoundError';
import { ClientError } from './errors/ClientError';
import { NblocksClient } from './platform/nblocks-client';

describe('Platform client', () => {

    let client: NblocksClient;
    let mock: MockAdapter;
    beforeAll(() => {
        client = new NblocksClient("SECRET", 1, false, 'DEV');
        mock = new MockAdapter(client["httpClient"]);
    });

    test('Test UnauthenticatedError', async () => {
        mock.onGet("/app").reply(401);
        const promise = client.config.getAppProfile();
        await expect(promise).rejects.toThrowError(UnauthenticatedError);
    });

    test('Test ForbiddenError', async () => {
        mock.onGet("/app").reply(403);
        const promise = client.config.getAppProfile();
        await expect(promise).rejects.toThrowError(ForbiddenError);
    });

    test('Test NotFoundError', async () => {
        mock.onGet("/app").reply(404);
        const promise = client.config.getAppProfile();
        await expect(promise).rejects.toThrowError(NotFoundError);
    });

    test('Test ClientError', async () => {
        mock.onGet("/app").reply(500);
        const promise = client.config.getAppProfile();
        await expect(promise).rejects.toThrowError(ClientError);
    });
})