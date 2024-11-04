export interface ValidateImportTenantResult { 
    tenants: number; 
    users: number;
    passwords: boolean;
    errors: string[];
    warnings: string[]; 
    approved: boolean;
}