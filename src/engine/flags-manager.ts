import { BulkEvaluationResponse } from '../core-api/flag/models/bulk-evaluation-response';
import { FlagContext } from '../core-api/flag/models/context';
import { ILogger } from './models/logger.interface';
import { ClientError } from '../errors/ClientError';
import { UnauthenticatedError } from '../errors/UnauthenticatedError';

export interface FlagsManagerConfig {
  getFlagsClient: () => IFlagsClient;
  onFlagsUpdated: (flags: BulkEvaluationResponse) => void;
  logger?: ILogger;
  onError?: (error: ClientError | UnauthenticatedError) => void;
}

export interface IFlagsClient {
  bulkEvaluate(params: { accessToken: string; context?: FlagContext }): Promise<BulkEvaluationResponse>;
}

export class FlagsManager {
  private context?: FlagContext;
  private flagsStorage?: BulkEvaluationResponse;
  private config: FlagsManagerConfig;

  constructor(config: FlagsManagerConfig) {
    this.config = config;
  }

  setContext(ctx: FlagContext | undefined): void {
    this.context = ctx;
    this.config.logger?.log('Flag context updated');
  }

  flagEnabled(flagKey: string): boolean {
    if (!this.flagsStorage) {
      this.config.logger?.log(`Flag ${flagKey} checked before storage initialization`);
      return false;
    }
    const flag = this.flagsStorage.flags.find(f => f.flag === flagKey);
    const enabled = flag?.evaluation.enabled ?? false;
    this.config.logger?.log(`Flag ${flagKey} evaluated as ${enabled}`);
    return enabled;
  }

  async evaluateFlags(accessToken?: string): Promise<void> {
    if (!accessToken) {
      const error = new UnauthenticatedError({ error: 'NO_ACCESS_TOKEN', message: 'No access token provided for flag evaluation' });
      this.config.logger?.logError(error);
      this.config.onError?.(error);
      return;
    }

    try {
      this.config.logger?.log('Starting flag evaluation');
      const flagsClient = this.config.getFlagsClient();
      const response = await flagsClient.bulkEvaluate({ 
        accessToken, 
        context: this.context 
      });
      
      this.flagsStorage = response;
      this.config.onFlagsUpdated(response);
      this.config.logger?.log(`Flags evaluated successfully. Found ${response.flags.length} flags`);
    } catch (error) {
      const clientError = new ClientError({ message: 'Error during flag evaluation', error });
      this.config.logger?.logError(clientError);
      this.config.onError?.(clientError);
    }
  }
} 