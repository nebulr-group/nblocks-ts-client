import { NblocksPublicClient } from "../nblocks-public-client";
import MockAdapter from "axios-mock-adapter";
import * as TokensResponseMock from '../../../test/tokens-response.mock.json';
import { OAuth } from "./oauth";

describe('oauth client', () => {
    let oauth: OAuth;
    
    let mockApi: MockAdapter;
    beforeAll(() => {
      oauth = new OAuth(new NblocksPublicClient({appId: "app_123"}));
      mockApi = new MockAdapter(oauth.getHttpClient());
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('Is defined', async () => {
        expect(oauth).toBeDefined();
    });

    test('Get login url', async () => {
      expect(oauth.getLoginUrl()).toBe("https://auth.nblocks.cloud/url/login/app_123");
    });

    test('Get logout url', async () => {
      expect(oauth.getLogoutUrl()).toBe("https://auth.nblocks.cloud/url/logout/app_123");
    });

    test('Get tokens', async () => {
      mockApi.onPost("/token/code/app_123").reply(200, TokensResponseMock);
      const response = await oauth['_getTokens']("xx.xxx.xx");
      expect(response.access_token).toBeDefined();
      expect(response.expires_in).toBeDefined();
      expect(response.id_token).toBeDefined();
      expect(response.refresh_token).toBeDefined();
      expect(response.token_type).toBeDefined();
    });

    test('Refresh tokens', async () => {
      mockApi.onPost("/token/refresh/app_123").reply(200, TokensResponseMock);
      const response = await oauth['_refreshTokens']("xx.xxx.xx");
      expect(response.access_token).toBeDefined();
      expect(response.expires_in).toBeDefined();
      expect(response.id_token).toBeDefined();
      expect(response.refresh_token).toBeDefined();
      expect(response.token_type).toBeDefined();
    });
})