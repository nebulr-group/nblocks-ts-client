import { ValidateImportTenantResult } from "./validate-import-tenant.response";

export interface ImportTenantScheduledResponse {
    import: ValidateImportTenantResult;
    status: 'ERROR' | 'SCHEDULED' | 'COMPLETED';
}