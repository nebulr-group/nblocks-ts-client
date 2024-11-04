import { FlagsManager, FlagsManagerConfig, IFlagsClient } from '../flags-manager';
import { BulkEvaluationResponse, UserContext } from '../../platform/flag/models/context';

describe('FlagsManager', () => {
  let flagsManager: FlagsManager;
  let config: FlagsManagerConfig;
  let mockFlagsClient: IFlagsClient;
  let bulkEvaluateSpy: jest.Mock;
  let mockResponse: BulkEvaluationResponse;
  let mockUserContext: UserContext;

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

    bulkEvaluateSpy = jest.fn().mockResolvedValue(mockResponse);
    mockFlagsClient = {
      bulkEvaluate: bulkEvaluateSpy
    };

    config = {
      getFlagsClient: () => mockFlagsClient,
      onFlagsUpdated: jest.fn(),
      onLog: jest.fn(),
      onError: jest.fn()
    };

    flagsManager = new FlagsManager(config);
  });

  it('should create an instance', () => {
    expect(flagsManager).toBeDefined();
  });

  describe('setContext', () => {
    it('should update context and log the change', () => {
      const context = { user: mockUserContext };
      flagsManager.setContext(context);

      expect(config.onLog).toHaveBeenCalledWith('Flag context updated');
    });

    it('should handle undefined context', () => {
      flagsManager.setContext(undefined);

      expect(config.onLog).toHaveBeenCalledWith('Flag context updated');
    });
  });

  describe('flagEnabled', () => {
    it('should return false when flags storage is not initialized', () => {
      const result = flagsManager.flagEnabled('test-flag');

      expect(result).toBe(false);
      expect(config.onLog).toHaveBeenCalledWith('Flag test-flag checked before storage initialization');
    });

    it('should return true for enabled flag', async () => {
      await flagsManager.evaluateFlags('test-token');
      const result = flagsManager.flagEnabled('test-flag-1');

      expect(result).toBe(true);
      expect(config.onLog).toHaveBeenCalledWith('Flag test-flag-1 evaluated as true');
    });

    it('should return false for disabled flag', async () => {
      await flagsManager.evaluateFlags('test-token');
      const result = flagsManager.flagEnabled('test-flag-2');

      expect(result).toBe(false);
      expect(config.onLog).toHaveBeenCalledWith('Flag test-flag-2 evaluated as false');
    });
  });

  describe('evaluateFlags', () => {
    it('should skip evaluation when no access token is provided', async () => {
      await flagsManager.evaluateFlags(undefined);

      expect(bulkEvaluateSpy).not.toHaveBeenCalled();
      expect(config.onLog).toHaveBeenCalledWith('Evaluation skipped - No access token provided');
    });

    it('should evaluate flags successfully with access token', async () => {
      await flagsManager.evaluateFlags('test-token');

      expect(bulkEvaluateSpy).toHaveBeenCalledWith({
        accessToken: 'test-token',
        context: undefined
      });
      expect(config.onFlagsUpdated).toHaveBeenCalledWith(mockResponse);
      expect(config.onLog).toHaveBeenCalledWith('Starting flag evaluation');
      expect(config.onLog).toHaveBeenCalledWith('Flags evaluated successfully. Found 2 flags');
    });

    it('should handle evaluation errors', async () => {
      const error = new Error('Test error');
      bulkEvaluateSpy.mockRejectedValue(error);

      await flagsManager.evaluateFlags('test-token');

      expect(config.onError).toHaveBeenCalledWith(error);
      expect(config.onLog).toHaveBeenCalledWith('Error during flag evaluation');
    });
  });
}); 