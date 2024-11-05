import { ClientError } from '../errors/ClientError';
import { ILogger } from './models/logger.interface';

export interface LoginManagerConfig {
  getLoginUrl: () => string | undefined;
  onError?: (error: ClientError) => void;
  clearTokens: () => void;
  redirect: (url: string) => void;
  logger?: ILogger;
}

export class LoginManager {
  private config: LoginManagerConfig;

  constructor(config: LoginManagerConfig) {
    this.config = config;
  }

  redirectToLogin(): void {
    this.config.clearTokens();
    const loginUrl = this.config.getLoginUrl();
    
    if (loginUrl) {
      this.config.redirect(loginUrl);
    } else {
      const error = new ClientError('Failed to get login URL');
      this.config.logger?.logError(error);
      this.config.onError?.(error);
    }
  }
} 