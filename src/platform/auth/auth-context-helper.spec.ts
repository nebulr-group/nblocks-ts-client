import { JwtError } from "../../errors/JwtError";
import { NblocksClient } from "../nblocks-client";
import {AuthContextHelper} from './auth-context-helper'

describe('Auth client', () => {
    let helper: AuthContextHelper;
    
    beforeAll(() => {
        helper = new AuthContextHelper(new NblocksClient({appId: "id"}), 'DEV', true);
    });

    beforeEach(() => {
        
    });

    test('Is defined', async () => {
        expect(helper).toBeDefined();
    });

    test('Should deny expired token', async () => {
      /**
       * 1. Token is expired
       */
      const jwt = 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc2VVkwNzd5b2FPZGFDWUVOZ0M0MFlaUzZLQ2psNXpBLS1sQW1JYzBFaU0ifQ.eyJhaWQiOiI2MzM0MDJmZGYyOGQ4ZTAwMjUyOTQ4YjEiLCJ0aWQiOiI2MzM0MDJmZGYyOGQ4ZTAwMjUyOTQ4YjYiLCJzY29wZSI6IkFVVEhFTlRJQ0FURUQgVVNFUl9SRUFEIFVTRVJfV1JJVEUgVEVOQU5UX1JFQUQgVEVOQU5UX1dSSVRFIiwicm9sZSI6Ik9XTkVSIiwicGxhbiI6IlRFQU0iLCJpYXQiOjE2ODU3MDY4NjgsImV4cCI6MTY4NTcwNjg3OCwiYXVkIjpbIjYzMzQwMmZkZjI4ZDhlMDAyNTI5NDhiMSIsImJhY2tlbmRsZXNzLm5ibG9ja3MuY2xvdWQiLCJhcHAubmJsb2Nrcy5jbG91ZCJdLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwNzAiLCJzdWIiOiI2MzM0MDJmZWYyOGQ4ZTAwMjUyOTQ4YmYifQ.SLud4M7KpWiUI8H-NLF_l5A8hakx6_9w1woyXJKysJDIyv7BT15OTkmrnHdt_DVKKA7D98ZZT_q7Rcqj_XbgpIkpcOSkjYOZ02Pc3ttGkWa9-t2OYviY1eLAM6sPtTSdN6IPlxg87HEyvqERhz7pUVB_qWB7P1aZv1aSVDzmBYjoxKQnem0l8crU3dsUICPYpXoMbopyawa6Q_QcHoPtL-nYlb0AhUCZIpBPUmP3qxsdkRwTa5HyXoslDmVhrLeh4QkQp8t6gMQJMrAnjxA9wQ5eRwPkbQgJ-Newb6apkXTyLs1OpjpYKOJQqWTIWiZ-sCR5JtpcMtxEZrFPXsbr6Q';
      const promise = helper.getAuthContext(jwt);

      await expect(promise).rejects.toThrowError(JwtError);
    });

    test('Should deny faulty token', async () => {
      /**
       * 1. Token corrupt
       */
      const jwt = 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc2VVkwNzd5b2FPZGFDWUVOZ0M0MFlaUzZLQ2psNXpBLS1sQW1JYzBFaU0ifQ.eyJhaWQiOiI2MzM0MDJmZGYyOGQ4ZTAwMjUyOTQ4YjEiLCJ0aWQiOiI2MzM0MDJmZGYyOGQ4ZTAwMjUyOTQ4YjYiLCJzY29wZSI6IkFVVEhFTlRJQ0FURUQgVVNFUl9SRUFEIFVTRVJfV1JJVEUgVEVOQU5UX1JFQUQgVEVOQU5UX1dSSVRFIiwicm9sZSI6Ik9XTkVSIiwicGxhbiI6IlRFQU0iLCJpYXQiOjE2ODU3MDY4NjgsImV4cCI6MTY4NTcwNjg3OCwiYXVkIjpbIjYzMzQwMmZkZjI4ZDhlMDAyNTI5NDhiMSIsImJhY2tlbmRsZXNzLm5ibG9ja3MuY2xvdWQiLCJhcHAubmJsb2Nrcy5jbG91ZCJdLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwNzAiLCJzdWIiOiI2MzM0MDJmZWYyOGQ4ZTAwMjUyOTQ4YmYifQ.SLud4M7KpWiUI8H-NLF_l5A8hakx6_9w1woyXJKysJDIyv7BT15OTkmrnHdt_DVKKA7D98ZZT_q7Rcqj_XbgpIkpcOSkjYOZ02Pc3ttGkWa9-t2OYviY1eLAM6sPtTSdN6IPlxg87HEyvqERhz7pUVB_qWB7P1aZv1aSVDzmBYjoxKQnem0l8crU3dsUICPYpXoMbopyawa6Q_QcHoPtL-nYlb0AhUCZIpBPUmP3qxsdkRwTa5HyXoslDmVhrLeh4QkQp8t6gMQJMrAnjxA9wQ5eRwPkbQgJ-Newb6apkXTyLs1OpjpYKOJQqWTIWiZ-sCR5JtpcMtxEZr';
      const promise = helper.getAuthContext(jwt);

      await expect(promise).rejects.toThrowError(JwtError);
    });

    // test('Can return open id profile', async () => {
    //   const jwt = 'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilc2VVkwNzd5b2FPZGFDWUVOZ0M0MFlaUzZLQ2psNXpBLS1sQW1JYzBFaU0ifQ.eyJuYW1lIjoiT3NjYXIgU8O2ZGVybHVuZCIsImdpdmVuX25hbWUiOiJPc2NhciIsImZhbWlseV9uYW1lIjoiU8O2ZGVybHVuZCIsImxvY2FsZSI6ImVuIiwicGljdHVyZSI6IiIsInRlbmFudF9pZCI6IjYzMzQwMmZkZjI4ZDhlMDAyNTI5NDhiNiIsInRlbmFudF9uYW1lIjoiT3NjYXJzIGNyaWIiLCJlbWFpbCI6Im9zY2FyQG5lYnVsci5ncm91cCIsImlhdCI6MTY3NTkzMzU2NSwiYXVkIjpbIjYzMzQwMmZkZjI4ZDhlMDAyNTI5NDhiMSJdLCJpc3MiOiJhdXRoLm5ibG9ja3MuY2xvdWQiLCJzdWIiOiI2MzM0MDJmZWYyOGQ4ZTAwMjUyOTQ4YmYifQ.C2O2Lm3dQomzemUECQeZCv6k3o5MNCgh7DkbyfUiHg2YgoEhJcSSmEoKA9mc3Ff0xvNbbDubdqVUM2-KbCnnQRWZmfHdkrB01t2FYpERRDqxTwIyD0T1nDBe8VnjCESJUCY-rTKiFoyy6hQl9xBn7DzE6OskuaVf3FPT_3ugENXbv5Y1WIUGmFEa--tELarJx2AUb9EKV5T5FVnKxz5X7oXDDljfZLrjW1IBN5JOt5zrYFCXz06zL6HkUqm-rJjoItUNgZT2AdA_AZ5fnHQVQsYpQqaNn4l6ms1OzUSSEUA4UBY_l2Trfd4PIxevWjqvOjeOHjYqFEeJdXO1804Wmw';
    //   expect(helper).toBeDefined();
    // });

})