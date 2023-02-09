import { JwtError } from "../../errors/JwtError";
import {AuthContextHelper} from './auth-context-helper'

describe('Auth client', () => {
    let helper: AuthContextHelper;
    
    beforeAll(() => {
        helper = new AuthContextHelper('STAGE', true);
    });

    beforeEach(() => {
        
    });

    test('Is defined', async () => {
        expect(helper).toBeDefined();
    });

    test('Should deny faulty token (strict)', async () => {
      /**
       * 1. Token is expired
       * 2. Token singed locally and not on stage
       */
      const jwt = 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc2VVkwNzd5b2FPZGFDWUVOZ0M0MFlaUzZLQ2psNXpBLS1sQW1JYzBFaU0ifQ.eyJhaWQiOiI2MzM0MDJmZGYyOGQ4ZTAwMjUyOTQ4YjEiLCJ0aWQiOiI2MzM0MDJmZGYyOGQ4ZTAwMjUyOTQ4YjYiLCJzY29wZSI6IkFVVEhFTlRJQ0FURUQgVVNFUl9SRUFEIFVTRVJfV1JJVEUgVEVOQU5UX1JFQUQgVEVOQU5UX1dSSVRFIiwicm9sZSI6Ik9XTkVSIiwicGxhbiI6IlRFQU0iLCJpYXQiOjE2NzU5MzM1NjUsImV4cCI6MTY3NTkzNzE2NSwiYXVkIjpbIjYzMzQwMmZkZjI4ZDhlMDAyNTI5NDhiMSIsImJhY2tlbmRsZXNzLm5ibG9ja3MuY2xvdWQiXSwiaXNzIjoiYXV0aC5uYmxvY2tzLmNsb3VkIiwic3ViIjoiNjMzNDAyZmVmMjhkOGUwMDI1Mjk0OGJmIn0.F2_5LFTeE6bRLgZ9gLj20xbv4my2CXI55LKyR3KqIusKZ8HEsDhKmVedkH_UaxSy_K7-LXxgYFrc654T_OIO86M6cEYToItMVGgzisncb6lNllhA62MZS5Zrpel6s_K3yOmOluX756TlE08mThjEoCTLJ7bt6ab2pPajwnf1pNRt_pm6z8JmtXQpkS_plKu9OS-YeBwK2QnxLKilI0e2RfbjksYI7OSAOXuk7bVFbfUEFq81N3dsW21B3wLoxbP4fRWWlM0ia7hQ7Vk9RlNpgIi4sr05oibNM0I2ltvDaBjNYohxFlmcssTVYmaux3CgPuqb7ummFWtdTDdL7pNvdw';
      const promise = helper.getAuthContext(jwt);

      await expect(promise).rejects.toThrowError(JwtError);
    });

    test('Can parse auth context from a JWT (non strict)', async () => {
      const jwt = 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc2VVkwNzd5b2FPZGFDWUVOZ0M0MFlaUzZLQ2psNXpBLS1sQW1JYzBFaU0ifQ.eyJhaWQiOiI2MzM0MDJmZGYyOGQ4ZTAwMjUyOTQ4YjEiLCJ0aWQiOiI2MzM0MDJmZGYyOGQ4ZTAwMjUyOTQ4YjYiLCJzY29wZSI6IkFVVEhFTlRJQ0FURUQgVVNFUl9SRUFEIFVTRVJfV1JJVEUgVEVOQU5UX1JFQUQgVEVOQU5UX1dSSVRFIiwicm9sZSI6Ik9XTkVSIiwicGxhbiI6IlRFQU0iLCJpYXQiOjE2NzU5MzM1NjUsImV4cCI6MTY3NTkzNzE2NSwiYXVkIjpbIjYzMzQwMmZkZjI4ZDhlMDAyNTI5NDhiMSIsImJhY2tlbmRsZXNzLm5ibG9ja3MuY2xvdWQiXSwiaXNzIjoiYXV0aC5uYmxvY2tzLmNsb3VkIiwic3ViIjoiNjMzNDAyZmVmMjhkOGUwMDI1Mjk0OGJmIn0.F2_5LFTeE6bRLgZ9gLj20xbv4my2CXI55LKyR3KqIusKZ8HEsDhKmVedkH_UaxSy_K7-LXxgYFrc654T_OIO86M6cEYToItMVGgzisncb6lNllhA62MZS5Zrpel6s_K3yOmOluX756TlE08mThjEoCTLJ7bt6ab2pPajwnf1pNRt_pm6z8JmtXQpkS_plKu9OS-YeBwK2QnxLKilI0e2RfbjksYI7OSAOXuk7bVFbfUEFq81N3dsW21B3wLoxbP4fRWWlM0ia7hQ7Vk9RlNpgIi4sr05oibNM0I2ltvDaBjNYohxFlmcssTVYmaux3CgPuqb7ummFWtdTDdL7pNvdw';
      const context = helper.getAuthContextNonStrict(jwt);

      expect(context).toMatchObject({
        appId: '633402fdf28d8e00252948b1',
        tenantPlan: 'TEAM',
        tenantId: '633402fdf28d8e00252948b6',
        userRole: 'OWNER',
        userId: '633402fef28d8e00252948bf',
        privileges: [
          'AUTHENTICATED',
          'USER_READ',
          'USER_WRITE',
          'TENANT_READ',
          'TENANT_WRITE'
        ]
      })
    });

    // test('Can return open id profile', async () => {
    //   const jwt = 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc2VVkwNzd5b2FPZGFDWUVOZ0M0MFlaUzZLQ2psNXpBLS1sQW1JYzBFaU0ifQ.eyJuYW1lIjoiT3NjYXIgU8O2ZGVybHVuZCIsImdpdmVuX25hbWUiOiJPc2NhciIsImZhbWlseV9uYW1lIjoiU8O2ZGVybHVuZCIsImxvY2FsZSI6ImVuIiwicGljdHVyZSI6IiIsInRlbmFudF9pZCI6IjYzMzQwMmZkZjI4ZDhlMDAyNTI5NDhiNiIsInRlbmFudF9uYW1lIjoiT3NjYXJzIGNyaWIiLCJlbWFpbCI6Im9zY2FyQG5lYnVsci5ncm91cCIsImlhdCI6MTY3NTkzMzU2NSwiYXVkIjpbIjYzMzQwMmZkZjI4ZDhlMDAyNTI5NDhiMSJdLCJpc3MiOiJhdXRoLm5ibG9ja3MuY2xvdWQiLCJzdWIiOiI2MzM0MDJmZWYyOGQ4ZTAwMjUyOTQ4YmYifQ.C2O2Lm3dQomzemUECQeZCv6k3o5MNCgh7DkbyfUiHg2YgoEhJcSSmEoKA9mc3Ff0xvNbbDubdqVUM2-KbCnnQRWZmfHdkrB01t2FYpERRDqxTwIyD0T1nDBe8VnjCESJUCY-rTKiFoyy6hQl9xBn7DzE6OskuaVf3FPT_3ugENXbv5Y1WIUGmFEa--tELarJx2AUb9EKV5T5FVnKxz5X7oXDDljfZLrjW1IBN5JOt5zrYFCXz06zL6HkUqm-rJjoItUNgZT2AdA_AZ5fnHQVQsYpQqaNn4l6ms1OzUSSEUA4UBY_l2Trfd4PIxevWjqvOjeOHjYqFEeJdXO1804Wmw';
    //   expect(helper).toBeDefined();
    // });

})