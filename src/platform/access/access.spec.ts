import * as rolesMock from '../../../test/roles-response.mock.json';
import * as roleMock from '../../../test/role-response.mock.json';
import * as privilegesMock from '../../../test/privileges-response.mock.json';
import * as privilegeMock from '../../../test/privilege-response.mock.json';
import MockAdapter from 'axios-mock-adapter';
import { NblocksClient } from '../nblocks-client';
import { AppModel } from '../models/app.model';
import { Access } from './access';

describe('Platform access client', () => {

  let client: NblocksClient;
  let access: Access;
  let app: AppModel;
  let mockApi: MockAdapter;

  beforeAll(() => {
    client = new NblocksClient({ appId: "id", apiKey: "SECRET", stage: 'DEV' });
    access = client.access;
    mockApi = new MockAdapter(client["httpClient"]);
  });

  beforeEach(() => {
    mockApi.reset();
  });

  test('List roles', async () => {
    mockApi.onGet("/role").reply(200, rolesMock);
    const response = await access.roles.list();
    expect(response[0].id).toBeDefined();
  });
 
  test('Create role', async () => {
    mockApi.onPost("/role").reply(200, roleMock);
    const response = await access.roles.create({name:"Admin", key: "ADMIN", isDefault: true, privileges: ["AUTHENTICATED"]});
    expect(response.id).toBeDefined();
  });

  test('Update role', async () => {
    mockApi.onPut(`/role/role_1234`).reply(200, { ...roleMock, ...{ name: "Another name" } });
    const response = await access.role("role_1234").update({name:"foobar"});
    expect(response.name).toBe("Another name");
  });

  test('Delete role', async () => {
    mockApi.onDelete(`/role/role_1234`).reply(200);
    await access.role("role_1234").delete();
  });

  test('List privileges', async () => {
    mockApi.onGet("role/privilege").reply(200, privilegesMock);
    const response = await access.privileges.list();
    expect(response[0].id).toBeDefined();
  });

  test('Create privilege', async () => {
    mockApi.onPost("role/privilege").reply(200, privilegeMock);
    const response = await access.privileges.create({key: "AUTHENTICATED", "description": "Foobar"});
    expect(response.id).toBeDefined();
  });

  test('Update privilege', async () => {
    mockApi.onPut(`role/privilege/privilege_1234`).reply(200, { ...privilegeMock, ...{ description: "Another description" } });
    const response = await access.privilege("privilege_1234").update({description: "Another description" });
    expect(response.description).toBe("Another description");
  });

  test('Delete privilege', async () => {
    mockApi.onDelete(`role/privilege/privilege_1234`).reply(200);
    await access.privilege("privilege_1234").delete();
  });

})