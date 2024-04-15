import { JWTPayload } from 'jose/dist/types/types';

export class AuthContext {
    appId: string;
    userId: string;
    tenantId: string;
    tenantPlan: string;
    userRole: string;
    privileges: string[];
    trial: boolean;
    shouldSelectPlan: boolean;
    shouldSetupPayments: boolean;
}

export interface AccessToken extends JWTPayload {
    tid: string;
    aid: string;
    scope: string;
    role: string;
    plan: string;
    trial: boolean;
    shouldSelectPlan: boolean;
    shouldSetupPayments: boolean;
}