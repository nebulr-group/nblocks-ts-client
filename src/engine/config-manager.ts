import { NblocksPluginConfig } from './models/plugin-config.model';
import { ClientError } from '../errors/ClientError';
import { ILogger } from './models/logger.interface';

export interface ConfigManagerConfig {
  logger?: ILogger;
}

/**
 * Manages the plugin/library configuration
 * 
 * This manager handles configuration related to how the library itself operates,
 * such as debug settings, redirects, and app identification.
 * 
 * For platform/account settings, use the Config class from platform/config instead.
 */
export class ConfigManager {
  protected config: NblocksPluginConfig;
  protected isConfigSet: boolean = false;
  private logger?: ILogger;

  constructor(config?: ConfigManagerConfig) {
    this.logger = config?.logger;
    this.config = {
      appId: '',
      handoverPath: '/',
      debug: false,
      stage: 'PROD',
      disableRedirects: false
    };
  }

  setConfig(config: Partial<NblocksPluginConfig>): void {
    this.config = { ...this.config, ...config };
    this.isConfigSet = true;
    this.validateConfig();
  }

  getConfig(): NblocksPluginConfig {
    this.validateConfig();
    return this.config;
  }

  protected validateConfig(): void {
    if (!this.isConfigSet) {
      const error = new ClientError('Configuration has not been set. Please call setConfig() before using the service.');
      this.logger?.logError(error);
      throw error;
    }
    if (!this.config.appId) {
      const error = new ClientError('appId is required and must be set.');
      this.logger?.logError(error);
      throw error;
    }
  }
}
