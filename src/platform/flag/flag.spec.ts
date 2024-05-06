import { NblocksPublicClient } from "../nblocks-public-client";
import {Flag} from "../flag/flag";
import MockAdapter from "axios-mock-adapter";
import { EvaluationResponse } from "./models/evaluation-response";
import { BulkEvaluationResponse } from "./models/bulk-evaluation-response";

describe('Flag client', () => {
    let flag: Flag;
    
    let mockApi: MockAdapter;
    beforeAll(() => {
      flag = new Flag(new NblocksPublicClient({appId: "app_123"}));
      mockApi = new MockAdapter(flag.getHttpClient());
    });

    beforeEach(() => {
        mockApi.reset();
    });

    test('Is defined', async () => {
        expect(flag).toBeDefined();
    });

    test('Evaluate a flag', async () => {
      mockApi.onPost("/flags/evaluate/app_123/flag_1").reply(200, { enabled: true } as EvaluationResponse);
      const response = await flag.evaluate("flag_1");
      expect(response.enabled).toBeTruthy();
    });

    test('Bulk evaluate a flag', async () => {
      mockApi.onPost("/flags/bulkEvaluate/app_123").reply(200,  { flags: [{flag: "flag_1", evaluation: {enabled: true}}] } as BulkEvaluationResponse);
      const response = await flag.bulkEvaluate();
      expect(response.flags).toHaveLength(1);
      expect(response.flags[0].flag).toBe("flag_1");
      expect(response.flags[0].evaluation.enabled).toBeTruthy();
    });
})