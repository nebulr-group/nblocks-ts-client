import { Log } from './log';
import { NblocksPluginConfig } from './models/nblocks-config.model';

describe('Log', () => {
  let log: Log;
  let mockConfig: NblocksPluginConfig;
  let consoleSpy: { log: jest.SpyInstance; error: jest.SpyInstance };

  beforeEach(() => {
    mockConfig = {
      appId: 'test-app',
      handoverPath: '/',
      debug: true,
      stage: 'PROD' as const,
      disableRedirects: false
    };

    // Spy on console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };

    log = new Log(mockConfig);
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
  });

  it('should create an instance', () => {
    expect(log).toBeTruthy();
  });

  describe('log', () => {
    it('should log message when debug is true', () => {
      const testMessage = 'test message';
      log.log(testMessage);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(`Nblocks: .* - ${testMessage}`)
      );
    });

    it('should not log message when debug is false', () => {
      mockConfig.debug = false;
      log = new Log(mockConfig);

      log.log('test message');

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('should log emphasized message with borders when emphasize is true', () => {
      const testMessage = 'emphasized message';
      log.log(testMessage, true);

      expect(consoleSpy.log).toHaveBeenCalledWith('#######################');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(`Nblocks: .* - ${testMessage}`)
      );
      expect(consoleSpy.log).toHaveBeenCalledWith('#######################');
    });
  });

  describe('logError', () => {
    it('should log error when debug is true', () => {
      const errorData = new Error('test error');
      log.logError(errorData);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching('Nblocks: .* - Error!')
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(errorData);
    });

    it('should not log error when debug is false', () => {
      mockConfig.debug = false;
      log = new Log(mockConfig);

      log.logError('test error');

      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it('should handle multiple error arguments', () => {
      const error1 = 'error1';
      const error2 = { message: 'error2' };
      const error3 = new Error('error3');

      log.logError(error1, error2, error3);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching('Nblocks: .* - Error!')
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(error1, error2, error3);
    });
  });
}); 