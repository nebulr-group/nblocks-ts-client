import { JWTPayload } from 'jose/dist/types/types';

export class AuthContext {
    appId: string;
    userId: string;
    tenantId: string;
    tenantPlan: string;
    userRole: string;
    privileges: string[];
}

export interface AuthJwt extends JWTPayload {
    tid: string;
    aid: string;
    scope: string;
    role: string;
    plan: string;
}