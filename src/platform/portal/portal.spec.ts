import { NblocksPublicClient } from "../nblocks-public-client";
import { Portal } from "./portal";

describe('Portal client', () => {
    let portal: Portal;
    
    beforeAll(() => {
        portal = new Portal(new NblocksPublicClient({appId: "app_123"}));
    });

    beforeEach(() => {
        
    });

    test('Is defined', async () => {
        expect(portal).toBeDefined();
    });

    test('Can return user management portal url', async () => {
      expect(portal.getUserManagementUrl("code_1234")).toBe("https://backendless.nblocks.cloud/user-management-portal/users?code=code_1234");
    });

    test('Can return select plan portal url', async () => {
      expect(portal.getSelectPlanUrl("code_1234")).toBe("https://backendless.nblocks.cloud/subscription-portal/selectPlan?code=code_1234");
    });
})