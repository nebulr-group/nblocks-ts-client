import { ConfigManager } from './config-manager';
import { NblocksPluginConfig } from './models/plugin-config.model'

describe('ConfigManager', () => {
  let configManager: ConfigManager;

  beforeEach(() => {
    configManager = new ConfigManager();
  });

  it('should create an instance', () => {
    expect(configManager).toBeTruthy();
  });

  it('should initialize with default values', () => {
    const defaultConfig: NblocksPluginConfig = {
      appId: '',
      handoverPath: '/',
      debug: false,
      stage: 'PROD' as const,
      disableRedirects: false
    };

    expect(configManager['config']).toEqual(defaultConfig);
    expect(configManager['isConfigSet']).toBeFalsy();
  });

  describe('setConfig', () => {
    it('should merge partial config with default values', () => {
      const partialConfig: Partial<NblocksPluginConfig> = {
        appId: 'test-app',
        debug: true
      };

      configManager.setConfig(partialConfig);

      expect(configManager['config']).toEqual({
        appId: 'test-app',
        handoverPath: '/',
        debug: true,
        stage: 'PROD' as const,
        disableRedirects: false
      });
      expect(configManager['isConfigSet']).toBe(true);
    });
  });

  describe('getConfig', () => {
    it('should throw error when config is not set', () => {
      expect(() => configManager.getConfig()).toThrowError(
        'Configuration has not been set. Please call setConfig() before using the service.'
      );
    });

    it('should throw error when appId is not set', () => {
      expect(() => configManager.setConfig({})).toThrowError(
        'appId is required and must be set.'
      );
    });

    it('should return config when properly set', () => {
      const validConfig: Partial<NblocksPluginConfig> = {
        appId: 'test-app'
      };

      configManager.setConfig(validConfig);
      const config = configManager.getConfig();

      expect(config).toEqual({
        appId: 'test-app',
        handoverPath: '/',
        debug: false,
        stage: 'PROD' as const,
        disableRedirects: false
      });
    });
  });

  describe('validateConfig', () => {
    it('should not throw error with valid config', () => {
      const validConfig: Partial<NblocksPluginConfig> = {
        appId: 'test-app'
      };

      expect(() => configManager.setConfig(validConfig)).not.toThrow();
    });

    it('should throw error when trying to set empty appId', () => {
      const invalidConfig: Partial<NblocksPluginConfig> = {
        appId: ''
      };

      expect(() => configManager.setConfig(invalidConfig)).toThrowError(
        'appId is required and must be set.'
      );
    });
  });
}); 