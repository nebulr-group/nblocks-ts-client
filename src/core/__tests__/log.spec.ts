import { Log } from '../log';
import { NblocksConfig } from '../config-manager';

describe('Log', () => {
  let log: Log;
  let mockConfig: NblocksConfig;
  let consoleSpy: { log: jest.SpyInstance; error: jest.SpyInstance };

  beforeEach(() => {
    mockConfig = {
      appId: 'test-app',
      handoverPath: '/',
      debug: true,
      stage: 'PROD',
      disableRedirects: false
    };

    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation()
    };

    log = new Log(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
  });
}); 