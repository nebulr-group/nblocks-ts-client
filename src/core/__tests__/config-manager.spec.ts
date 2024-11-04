import { ConfigManager } from '../config-manager';
import { NblocksConfig } from '../config-manager';

describe('ConfigManager', () => {
  let configManager: ConfigManager;

  beforeEach(() => {
    configManager = new ConfigManager();
  });

  it('should create an instance', () => {
    expect(configManager).toBeDefined();
  });

  it('should initialize with default values', () => {
    const defaultConfig: NblocksConfig = {
      appId: '',
      handoverPath: '/',
      debug: false,
      stage: 'PROD',
      disableRedirects: false
    };

    expect(configManager['config']).toEqual(defaultConfig);
    expect(configManager['isConfigSet']).toBe(false);
  });

  describe('setConfig', () => {
    it('should merge partial config with default values', () => {
      const partialConfig: Partial<NblocksConfig> = {
        appId: 'test-app',
        debug: true
      };

      configManager.setConfig(partialConfig);

      expect(configManager['config']).toEqual({
        appId: 'test-app',
        handoverPath: '/',
        debug: true,
        stage: 'PROD',
        disableRedirects: false
      });
      expect(configManager['isConfigSet']).toBe(true);
    });
  });

  describe('getConfig', () => {
    it('should throw error when config is not set', () => {
      expect(() => configManager.getConfig()).toThrow(
        'Configuration has not been set. Please call setConfig() before using the service.'
      );
    });

    it('should throw error when appId is not set', () => {
      expect(() => configManager.setConfig({})).toThrow(
        'appId is required and must be set.'
      );
    });

    it('should return config when properly set', () => {
      const validConfig: Partial<NblocksConfig> = {
        appId: 'test-app'
      };

      configManager.setConfig(validConfig);
      const config = configManager.getConfig();

      expect(config).toEqual({
        appId: 'test-app',
        handoverPath: '/',
        debug: false,
        stage: 'PROD',
        disableRedirects: false
      });
    });
  });
}); 