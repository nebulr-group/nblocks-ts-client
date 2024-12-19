import { ClientError } from '../errors/ClientError';
import { LoginManager, LoginManagerConfig } from './login-manager';

describe('LoginManager', () => {
  let loginManager: LoginManager;
  let config: LoginManagerConfig;
  let mockRedirect: jest.Mock;

  beforeEach(() => {
    mockRedirect = jest.fn();
    
    // Create mocks for the config
    config = {
      getLoginUrl: jest.fn().mockReturnValue('https://login.example.com'),
      onError: jest.fn(),
      clearTokens: jest.fn(),
      redirect: mockRedirect
    };

    // Create the login manager
    loginManager = new LoginManager(config);
  });

  it('should clear tokens and redirect to login URL', () => {
    loginManager.redirectToLogin();

    expect(config.clearTokens).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith('https://login.example.com');
  });

  it('should handle error when login URL is undefined', () => {
    // Setup
    (config.getLoginUrl as jest.Mock).mockReturnValue(undefined);
    const mockLogger = { 
      logError: jest.fn(),
      log: jest.fn()
    };
    config.logger = mockLogger;
    
    // Act
    loginManager.redirectToLogin();

    // Assert
    expect(config.clearTokens).toHaveBeenCalled();
    expect(mockLogger.logError).toHaveBeenCalledWith(expect.any(ClientError));
    expect(config.onError).toHaveBeenCalledWith(expect.any(ClientError));
  });
}); 