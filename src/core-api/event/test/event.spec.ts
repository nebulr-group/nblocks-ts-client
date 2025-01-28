import MockAdapter from 'axios-mock-adapter';
import { NblocksClient } from '../../nblocks-client';
import { NblocksEvent } from '../event';
import listEventMock from './list-event-response.mock.json';
import createEventMock from './create-event-response-mock.json';


// Describe the Event client
describe('Event client', () => {

    let client: NblocksClient;
    let mockApi: MockAdapter;

    beforeAll(() => {
        client = new NblocksClient({appId: "id", apiKey: "SECRET", stage: 'DEV'});
        mockApi = new MockAdapter(client["httpClient"]);
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('Create an event', async () => {
        mockApi.onPost("/event").reply(200, createEventMock);
        const response = await client.event.create({
            eventName: "user_delete"
        });
        expect(response.id).toBeDefined();
        expect(response.eventName).toBe("user_delete");
    });

    test('List events', async () => {
        mockApi.onGet("/event").reply(200, listEventMock);
        const response = await client.event.list();
        expect(response.length).toBeGreaterThan(0);
    });

    test('Delete an event', async () => {
        const eventId = "12345";
        mockApi.onDelete(`/event/${eventId}`).reply(200);
        await client.event.delete(eventId);
        // No response to check, just ensure no errors are thrown
    });
}); 