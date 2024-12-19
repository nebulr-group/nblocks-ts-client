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
    
    // Advance timers to trigger the setTimeout
    jest.advanceTimersByTime(1);
    // Wait for any promises to resolve
    await Promise.resolve();

    expect(config.refreshTokens).toHaveBeenCalledWith('test-refresh-token');
  });

  it('should not start refresh cycle when in restricted path', () => {
    (config.isRestrictedPath as jest.Mock).mockReturnValue(true);
    tokenRefresher.startRefreshCycle('test-refresh-token');

    expect(config.refreshTokens).not.toHaveBeenCalled();
  });

  it('should schedule next refresh after successful token refresh', async () => {
    // Start the refresh cycle - this schedules the first refresh with delay 0
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first refresh
    jest.advanceTimersByTime(1); // Trigger the setTimeout callback

    // First Promise.resolve: Process the setTimeout callback
    // This allows the async function inside setTimeout to start executing
    await Promise.resolve();

    // Second Promise.resolve: Allow the refreshTokens Promise to complete
    // This is where the mock returns the new tokens
    await Promise.resolve();

    // Third Promise.resolve: Allow the scheduling of the next refresh to complete
    // This ensures the new setTimeout is set up with the next delay
    await Promise.resolve();

    // Clear first set of calls to prepare for checking the second refresh
    (config.refreshTokens as jest.Mock).mockClear();
    
    // Advance clock to trigger next refresh (90% of expires_in)
    jest.advanceTimersByTime(3240 * 1000); // 90% of 3600 seconds = 3240 seconds

    // Same three Promise.resolve pattern for the second refresh:
    await Promise.resolve();  // Process setTimeout callback
    await Promise.resolve();  // Complete refreshTokens Promise
    await Promise.resolve();  // Allow next refresh scheduling

    // Verify that refreshTokens was called exactly once for the second refresh
    expect(config.refreshTokens).toHaveBeenCalledTimes(1);
  });

  it('should retry on error with retry interval', async () => {
    // Setup the mock to reject with a specific error
    const testError = new Error('Test error');
    (config.refreshTokens as jest.Mock).mockRejectedValueOnce(testError);
    
    tokenRefresher.startRefreshCycle('test-refresh-token');
    
    // Handle first failed refresh attempt
    jest.advanceTimersByTime(1);
    // Allow the promise to resolve and the error to be caught
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve(); // Add one more tick to ensure error handling completes

    expect(config.onError).toHaveBeenCalled();
    
    // Clear the calls to start fresh
    (config.refreshTokens as jest.Mock).mockClear();
    
    // Advance to retry
    jest.advanceTimersByTime(60 * 1000); // Advance by retry interval (60 seconds)
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