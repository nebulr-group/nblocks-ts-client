import { LoginManager, LoginManagerConfig } from '../login-manager';

describe('LoginManager', () => {
  let loginManager: LoginManager;
  let config: LoginManagerConfig;
  let locationRef: Partial<Location>;

  beforeEach(() => {
    locationRef = { href: '' };
    
    config = {
      getLoginUrl: jest.fn().mockReturnValue('https://login.example.com'),
      onError: jest.fn(),
      clearTokens: jest.fn(),
      locationRef: locationRef as Location
    };

    loginManager = new LoginManager(config);
  });

  it('should create an instance', () => {
    expect(loginManager).toBeTruthy();
  });

  it('should clear tokens and redirect to login URL', () => {
    loginManager.redirectToLogin();

    expect(config.clearTokens).toHaveBeenCalled();
    expect(locationRef.href).toBe('https://login.example.com');
  });

  it('should handle error when login URL is undefined', () => {
    (config.getLoginUrl as jest.Mock).mockReturnValue(undefined);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    loginManager.redirectToLogin();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to get login URL');
    expect(config.onError).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
}); 