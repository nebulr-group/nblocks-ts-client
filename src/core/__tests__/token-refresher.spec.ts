import { TokenRefresher, TokenRefresherConfig } from '../token-refresher';

describe('TokenRefresher', () => {
  let tokenRefresher: TokenRefresher;
  let config: TokenRefresherConfig;
  let mockTokens: { access_token: string; refresh_token: string; expires_in: number };

  beforeEach(() => {
    jest.useFakeTimers();

    mockTokens = {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      expires_in: 3600
    };

    config = {
      isRestrictedPath: jest.fn().mockReturnValue(false),
      getTokenExpiration: jest.fn().mockReturnValue(3600),
      refreshTokens: jest.fn().mockResolvedValue(mockTokens),
      onLog: jest.fn(),
      onError: jest.fn()
    };

    tokenRefresher = new TokenRefresher(config);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create an instance', () => {
    expect(tokenRefresher).toBeDefined();
  });

  it('should start refresh cycle when valid refresh token is provided', async () => {
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    await jest.runAllTimersAsync();

    expect(config.refreshTokens).toHaveBeenCalledWith('test-refresh-token');
  });

  it('should not start refresh cycle when in restricted path', () => {
    (config.isRestrictedPath as jest.Mock).mockReturnValue(true);
    tokenRefresher.startRefreshCycle('test-refresh-token');

    expect(config.refreshTokens).not.toHaveBeenCalled();
  });

  it('should schedule next refresh after successful token refresh', async () => {
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first refresh
    await jest.runAllTimersAsync();
    
    // Clear first set of calls
    (config.refreshTokens as jest.Mock).mockClear();
    
    // Advance clock to trigger next refresh (90% of expires_in)
    jest.advanceTimersByTime(3240 * 1000);
    await jest.runAllTimersAsync();

    expect(config.refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('should retry on error with retry interval', async () => {
    (config.refreshTokens as jest.Mock).mockRejectedValue(new Error('Test error'));
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first failed refresh attempt
    await jest.runAllTimersAsync();

    expect(config.onError).toHaveBeenCalled();
    
    // Clear the calls to start fresh
    (config.refreshTokens as jest.Mock).mockClear();
    
    // Advance to retry
    jest.advanceTimersByTime(60 * 1000);
    await jest.runAllTimersAsync();

    expect(config.refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('should clear expired tokens', () => {
    const now = new Date().getTime();
    (config.getTokenExpiration as jest.Mock).mockImplementation((token: string) => {
      if (token === 'expired') return (now - 1000) / 1000; // expired
      return (now + 3600000) / 1000; // valid
    });

    const result = tokenRefresher.clearExpiredTokens({
      refresh: 'valid',
      access: 'expired'
    });

    expect(result).toEqual({
      refresh: 'valid',
      access: undefined
    });
    expect(config.onLog).toHaveBeenCalledWith('Expired access token. Removing!');
  });
}); 