import { TokenRefresher, TokenRefresherConfig } from './token-refresher';

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
      logger: {
        log: jest.fn(),
        logError: jest.fn()
      },
      onError: jest.fn()
    };

    tokenRefresher = new TokenRefresher(config);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start refresh cycle when valid refresh token is provided', async () => {
    tokenRefresher.startRefreshCycle('test-refresh-token');
    await Promise.resolve();
    jest.advanceTimersByTime(0);
    await Promise.resolve();

    expect(config.refreshTokens).toHaveBeenCalledWith('test-refresh-token');
  });

  it('should not start refresh cycle when in restricted path', () => {
    (config.isRestrictedPath as jest.Mock).mockReturnValue(true);
    tokenRefresher.startRefreshCycle('test-refresh-token');

    expect(config.refreshTokens).not.toHaveBeenCalled();
  });

  it('should schedule next refresh after successful token refresh', async () => {
    // Start the refresh cycle
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first refresh
    await Promise.resolve();
    jest.advanceTimersByTime(0); // Process any immediate timers
    await Promise.resolve();

    // Clear first set of calls
    (config.refreshTokens as jest.Mock).mockClear();
    
    // Advance clock to trigger next refresh (90% of expires_in)
    jest.advanceTimersByTime(3240 * 1000);
    await Promise.resolve();
    jest.advanceTimersByTime(0); // Process any immediate timers
    await Promise.resolve();

    expect(config.refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('should retry on error with retry interval', async () => {
    (config.refreshTokens as jest.Mock).mockRejectedValue(new Error('Test error'));
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first failed refresh attempt
    await Promise.resolve();
    jest.advanceTimersByTime(0);
    await Promise.resolve();

    expect(config.onError).toHaveBeenCalled();
    
    // Clear the calls to start fresh
    (config.refreshTokens as jest.Mock).mockClear();
    
    // Advance to retry
    jest.advanceTimersByTime(60 * 1000);
    await Promise.resolve();
    jest.advanceTimersByTime(0);
    await Promise.resolve();

    expect(config.refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('should stop refresh cycle', async () => {
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first refresh
    await Promise.resolve();
    jest.advanceTimersByTime(0);
    await Promise.resolve();

    tokenRefresher.stopRefreshCycle();
    
    // Clear the calls to start fresh
    (config.refreshTokens as jest.Mock).mockClear();
    
    // Advance clock and verify no more refreshes
    jest.advanceTimersByTime(3600 * 1000);
    await Promise.resolve();
    jest.advanceTimersByTime(0);
    await Promise.resolve();

    expect(config.refreshTokens).toHaveBeenCalledTimes(0);
  });
}); 