export type EnvVariable =   "NBLOCKS_API_KEY" | 
                            "NBLOCKS_ACCOUNT_API_URL" | 
                            "NBLOCKS_AUTH_API_URL" | 
                            "NBLOCKS_AUTH_ISSUER" | 
                            "NBLOCKS_AUTH_AUDIENCE" | 
                            "NBLOCKS_FILE_API_URL" | 
                            "NBLOCKS_BACKENDLESS_API_URL" | 
                            "NBLOCKS_PDF_SERVICE_API_URL" | 
                            "NBLOCKS_ADMIN_API_URL" |
                            "NBLOCKS_COMMUNICATION_API_URL";

export class ConfigHelper {

    static getEnvVariable(variable: EnvVariable): string | undefined {
        return process && process.env ? process.env[variable] : undefined;
    }
}