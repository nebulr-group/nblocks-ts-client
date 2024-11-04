export interface TokenRefresherConfig {
  isRestrictedPath: () => boolean;
  getTokenExpiration: (token: string) => number;
  refreshTokens: (refreshToken: string) => Promise<{
    access_token: string;
    refresh_token: string;
    id_token?: string;
    expires_in: number;
  }>;
  onLog?: (message: string) => void;
  onError?: (error: unknown) => void;
  retryIntervalSeconds?: number;
}

export class TokenRefresher {
  private readonly retrySec: number;
  private refreshTimer: NodeJS.Timeout | null = null;
  private config: TokenRefresherConfig;

  constructor(config: TokenRefresherConfig) {
    this.config = config;
    this.retrySec = config.retryIntervalSeconds || 60;
  }

  startRefreshCycle(refreshToken: string | undefined): void {
    this.stopRefreshCycle();
    
    if (!refreshToken || this.config.isRestrictedPath()) {
      return;
    }

    this.scheduleNextRefresh(refreshToken, 0);
  }

  stopRefreshCycle(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private async scheduleNextRefresh(refreshToken: string, delay: number): Promise<void> {
    this.refreshTimer = setTimeout(async () => {
      try {
        const tokens = await this.config.refreshTokens(refreshToken);
        
        const expiresIn = Math.floor(tokens.expires_in * 0.9);
        this.config.onLog?.(`Tokens refreshed, scheduling new refresh in ${expiresIn} s because token expires in ${tokens.expires_in} s`);
        
        this.scheduleNextRefresh(tokens.refresh_token, expiresIn * 1000);
        
      } catch (error) {
        this.config.onError?.(error);
        this.config.onLog?.(`Due to previous error! Trying another refresh in ${this.retrySec}s`);
        this.scheduleNextRefresh(refreshToken, this.retrySec * 1000);
      }
    }, delay);
  }

  clearExpiredTokens(tokens: { refresh?: string; access?: string }): { refresh?: string; access?: string } {
    const now = new Date().getTime();

    if (tokens.refresh && now > this.config.getTokenExpiration(tokens.refresh) * 1000) {
      this.config.onLog?.('Expired refresh token. Removing!');
      return { ...tokens, refresh: undefined };
    }

    if (tokens.access && now > this.config.getTokenExpiration(tokens.access) * 1000) {
      this.config.onLog?.('Expired access token. Removing!');
      return { ...tokens, access: undefined };
    }

    return tokens;
  }
} 