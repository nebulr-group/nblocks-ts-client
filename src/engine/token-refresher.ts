import { TokensResponse } from '../core-api/auth/models/tokens.response.dto';
import { ILogger } from './models/logger.interface';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';
import { ClientError } from '../errors/ClientError';

export interface TokenRefresherConfig {
  isRestrictedPath: () => boolean;
  getTokenExpiration: (token: string) => number;
  refreshTokens: (refreshToken: string) => Promise<TokensResponse>;
  logger?: ILogger;
  onError?: (error: UnauthenticatedError | ClientError) => void;
  retryIntervalSeconds?: number;
}

export class TokenRefresher {
  private readonly retrySec: number;
  private refreshTimer: number | null = null;
  private config: TokenRefresherConfig;

  constructor(config: TokenRefresherConfig) {
    this.config = config;
    this.retrySec = config.retryIntervalSeconds || 60;
  }

  startRefreshCycle(refreshToken: string | undefined) {
    this.stopRefreshCycle();
    
    if (!refreshToken) {
      const error = new UnauthenticatedError({ error: 'NO_REFRESH_TOKEN', message: 'No refresh token provided to start refresh cycle' });
      this.config.logger?.logError(error);
      this.config.onError?.(error);
      return;
    }

    if (this.config.isRestrictedPath()) {
      return;
    }

    this.scheduleNextRefresh(refreshToken, 0);
  }

  stopRefreshCycle() {
    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private async scheduleNextRefresh(refreshToken: string, delay: number) {
    this.refreshTimer = window.setTimeout(async () => {
      try {
        const tokens = await this.config.refreshTokens(refreshToken);
        
        const expiresIn = Math.floor(tokens.expires_in * 0.9);
        this.config.logger?.log(`Tokens refreshed, scheduling new refresh in ${expiresIn} s because token expires in ${tokens.expires_in} s`);
        
        this.scheduleNextRefresh(tokens.refresh_token, expiresIn * 1000);
        
      } catch (error) {
        const clientError = new UnauthenticatedError({ 
          message: 'Failed to refresh tokens',
          error: 'REFRESH_FAILED'
        });
        this.config.logger?.logError(clientError);
        this.config.onError?.(clientError);
        this.config.logger?.log(`Due to previous error! Trying another refresh in ${this.retrySec}s`);
        this.scheduleNextRefresh(refreshToken, this.retrySec * 1000);
      }
    }, delay);
  }

  clearExpiredTokens(tokens: { refresh?: string; access?: string }) {
    const now = new Date().getTime();

    if (tokens.refresh && now > this.config.getTokenExpiration(tokens.refresh) * 1000) {
      const error = new UnauthenticatedError({ error: 'EXPIRED_REFRESH_TOKEN', message: 'Expired refresh token' });
      this.config.logger?.logError(error);
      return { ...tokens, refresh: undefined };
    }

    if (tokens.access && now > this.config.getTokenExpiration(tokens.access) * 1000) {
      const error = new UnauthenticatedError({ error: 'EXPIRED_ACCESS_TOKEN', message: 'Expired access token' });
      this.config.logger?.logError(error);
      return { ...tokens, access: undefined };
    }

    return tokens;
  }
} 