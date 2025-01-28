/**
 * Configuration for the Nblocks plugin/library behavior
 * This configuration controls how the library itself operates,
 * as opposed to platform/account settings.
 */
export interface NblocksPluginConfig {
  /** Unique identifier for the application using the library */
  appId: string;
  
  /** Path to redirect after authentication handover */
  handoverPath: string;
  
  /** Enable debug logging */
  debug: boolean;
  
  /** Environment stage - affects API endpoints */
  stage: 'PROD' | 'DEV' | 'STAGE';
  
  /** Disable automatic redirects for authentication flows */
  disableRedirects: boolean;
} 