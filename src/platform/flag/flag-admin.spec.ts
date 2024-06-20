import { FlagAdmin } from "./flag-admin";
import MockAdapter from "axios-mock-adapter";
import { NblocksClient } from "../nblocks-client";
import * as listFlagsMock from '../../../test/list-flags.mock.json';
import * as flagMock from '../../../test/flag.mock.json';
import * as listSegmentsMock from '../../../test/list-segments.mock.json';
import * as segmentMock from '../../../test/segment.mock.json';

describe('Flag admin client', () => {
  let flagAdmin: FlagAdmin;

  let mockApi: MockAdapter;
  beforeAll(() => {
    const client = new NblocksClient({ appId: "app_123", apiKey: "foobar"});
    flagAdmin = client.flagAdmin;
    mockApi = new MockAdapter(client['httpClient']);
  });

  beforeEach(() => {
    mockApi.reset();
  });

  test('Is defined', async () => {
    expect(flagAdmin).toBeDefined();
  });

  test('List flags', async () => {
    mockApi.onGet("/flags/flags").reply(200, listFlagsMock);
    const response = await flagAdmin.listFlags();
    expect(response).toHaveLength(4);
  });

  test('Create a flag', async () => {
    mockApi.onPost("/flags/flag").reply(200, flagMock);
    const response = await flagAdmin.createFlag({key: "premium-features"});
    expect(response.key).toBe("premium-features");
  });

  test('update a flag', async () => {
    mockApi.onPut("/flags/flag/6674409b7bc7fe186ab98a56").reply(200, flagMock);
    const response = await flagAdmin.updateFlag("6674409b7bc7fe186ab98a56", {key: 'premium-features'});
    expect(response.key).toBe('premium-features');
  });

  test('delete a flag', async () => {
    mockApi.onDelete("/flags/flag/6674409b7bc7fe186ab98a56").reply(200);
    await flagAdmin.deleteFlag("6674409b7bc7fe186ab98a56");
  });

  test('List segments', async () => {
    mockApi.onGet("/flags/segments").reply(200, listSegmentsMock);
    const response = await flagAdmin.listSegments();
    expect(response).toHaveLength(3);
  });

  test('Create a segment', async () => {
    mockApi.onPost("/flags/segment").reply(200, segmentMock);
    const response = await flagAdmin.createSegment({key: 'all-owners', targets: [{user: {role: {operator: 'eq', value: 'OWNER'}}}]});
    expect(response.key).toBe('all-owners');
    expect(response.targets).toEqual([
      {
          "user": {
              "role": {
                  "operator": "eq",
                  "value": "OWNER"
              }
          }
      }
  ])
  });

  test('update a flag', async () => {
    mockApi.onPut("/flags/segment/667447b583e592454b76d0ec").reply(200, segmentMock);
    const response = await flagAdmin.updateSegment("667447b583e592454b76d0ec", {key: 'all-owners'});
    expect(response.key).toBe('all-owners');
  });

  test('delete a flag', async () => {
    mockApi.onDelete("/flags/segment/667447b583e592454b76d0ec").reply(200);
    await flagAdmin.deleteSegment("667447b583e592454b76d0ec");
  });
})