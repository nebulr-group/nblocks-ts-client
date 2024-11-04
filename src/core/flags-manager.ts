import { BulkEvaluationResponse, FlagContext } from '../platform/flag/models/context';

export interface FlagsManagerConfig {
  getFlagsClient: () => IFlagsClient;
  onFlagsUpdated: (flags: BulkEvaluationResponse) => void;
  onLog?: (message: string) => void;
  onError?: (error: unknown) => void;
  retryIntervalSeconds?: number;
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
    this.config.onLog?.('Flag context updated');
  }

  flagEnabled(flagKey: string): boolean {
    if (!this.flagsStorage) {
      this.config.onLog?.(`Flag ${flagKey} checked before storage initialization`);
      return false;
    }
    const flag = this.flagsStorage.flags.find(f => f.flag === flagKey);
    const enabled = flag?.evaluation.enabled ?? false;
    this.config.onLog?.(`Flag ${flagKey} evaluated as ${enabled}`);
    return enabled;
  }

  async evaluateFlags(accessToken?: string): Promise<void> {
    if (!accessToken) {
      this.config.onLog?.('Evaluation skipped - No access token provided');
      return;
    }

    try {
      this.config.onLog?.('Starting flag evaluation');
      const flagsClient = this.config.getFlagsClient();
      const response = await flagsClient.bulkEvaluate({ 
        accessToken, 
        context: this.context 
      });
      
      this.flagsStorage = response;
      this.config.onFlagsUpdated(response);
      this.config.onLog?.(`Flags evaluated successfully. Found ${response.flags.length} flags`);
    } catch (error) {
      this.config.onLog?.('Error during flag evaluation');
      this.config.onError?.(error);
    }
  }
} 