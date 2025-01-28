import { FlagsManager, FlagsManagerConfig, IFlagsClient } from './flags-manager';
import { BulkEvaluationResponse } from '../core-api/flag/models/bulk-evaluation-response';
import { FlagContext, UserContext } from '../core-api/flag/models/context';
import { ILogger } from './models/logger.interface';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';

describe('FlagsManager', () => {
  let flagsManager: FlagsManager;
  let config: FlagsManagerConfig;
  let mockFlagsClient: IFlagsClient;
  let bulkEvaluateSpy: jest.Mock;
  let mockResponse: BulkEvaluationResponse;
  let mockUserContext: UserContext;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockResponse = {
      flags: [
        { flag: 'test-flag-1', evaluation: { enabled: true } },
        { flag: 'test-flag-2', evaluation: { enabled: false } }
      ]
    };

    mockUserContext = {
      id: 'test-user-id',
      email: 'test@example.com'
    };

    mockLogger = {
      log: jest.fn(),
      logError: jest.fn()
    };

    bulkEvaluateSpy = jest.fn().mockResolvedValue(mockResponse);
    mockFlagsClient = {
      bulkEvaluate: bulkEvaluateSpy
    };

    config = {
      getFlagsClient: () => mockFlagsClient,
      onFlagsUpdated: jest.fn(),
      logger: mockLogger,
      onError: jest.fn()
    };

    flagsManager = new FlagsManager(config);
  });

  it('should create an instance', () => {
    expect(flagsManager).toBeTruthy();
  });

  describe('setContext', () => {
    it('should update context and log the change', () => {
      const context: FlagContext = { user: mockUserContext };
      flagsManager.setContext(context);

      expect(mockLogger.log).toHaveBeenCalledWith('Flag context updated');
    });

    it('should handle undefined context', () => {
      flagsManager.setContext(undefined);

      expect(mockLogger.log).toHaveBeenCalledWith('Flag context updated');
    });
  });

  describe('flagEnabled', () => {
    it('should return false when flags storage is not initialized', () => {
      const result = flagsManager.flagEnabled('test-flag');

      expect(result).toBeFalsy();
      expect(mockLogger.log).toHaveBeenCalledWith('Flag test-flag checked before storage initialization');
    });

    it('should return true for enabled flag', async () => {
      await flagsManager.evaluateFlags('test-token');
      const result = flagsManager.flagEnabled('test-flag-1');

      expect(result).toBeTruthy();
      expect(mockLogger.log).toHaveBeenCalledWith('Flag test-flag-1 evaluated as true');
    });

    it('should return false for disabled flag', async () => {
      await flagsManager.evaluateFlags('test-token');
      const result = flagsManager.flagEnabled('test-flag-2');

      expect(result).toBeFalsy();
      expect(mockLogger.log).toHaveBeenCalledWith('Flag test-flag-2 evaluated as false');
    });

    it('should return false for non-existent flag', async () => {
      await flagsManager.evaluateFlags('test-token');
      const result = flagsManager.flagEnabled('non-existent-flag');

      expect(result).toBeFalsy();
      expect(mockLogger.log).toHaveBeenCalledWith('Flag non-existent-flag evaluated as false');
    });
  });

  describe('evaluateFlags', () => {
    it('should handle missing access token', async () => {
      await flagsManager.evaluateFlags(undefined);

      const expectedError = new UnauthenticatedError({ 
        error: 'NO_ACCESS_TOKEN', 
        message: 'No access token provided for flag evaluation' 
      });

      expect(bulkEvaluateSpy).not.toHaveBeenCalled();
      expect(mockLogger.logError).toHaveBeenCalledWith(expectedError);
      expect(config.onError).toHaveBeenCalledWith(expectedError);
    });

    it('should evaluate flags successfully with access token', async () => {
      await flagsManager.evaluateFlags('test-token');

      expect(bulkEvaluateSpy).toHaveBeenCalledWith({
        accessToken: 'test-token',
        context: undefined
      });
      expect(config.onFlagsUpdated).toHaveBeenCalledWith(mockResponse);
      expect(mockLogger.log).toHaveBeenCalledWith('Starting flag evaluation');
      expect(mockLogger.log).toHaveBeenCalledWith('Flags evaluated successfully. Found 2 flags');
    });

    it('should evaluate flags with context when provided', async () => {
      const context: FlagContext = { user: mockUserContext };
      flagsManager.setContext(context);
      await flagsManager.evaluateFlags('test-token');

      expect(bulkEvaluateSpy).toHaveBeenCalledWith({
        accessToken: 'test-token',
        context
      });
    });

    it('should handle evaluation errors', async () => {
      const error = new Error('Error during flag evaluation');
      bulkEvaluateSpy.mockImplementation(() => Promise.reject(error));

      await flagsManager.evaluateFlags('test-token');

      expect(mockLogger.logError).toHaveBeenCalledWith(error);      
    });
  });
}); 