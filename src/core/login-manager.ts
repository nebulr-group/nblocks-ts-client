export interface LoginManagerConfig {
  getLoginUrl: () => string | undefined;
  onError?: () => void;
  clearTokens: () => void;
  locationRef?: Location;
}

export class LoginManager {
  private config: LoginManagerConfig;
  private locationRef: Location;

  constructor(config: LoginManagerConfig) {
    this.config = config;
    this.locationRef = config.locationRef || (typeof window !== 'undefined' ? window.location : {} as Location);
  }

  redirectToLogin(): void {
    this.config.clearTokens();
    const loginUrl = this.config.getLoginUrl();
    
    if (loginUrl) {
      this.locationRef.href = loginUrl;
    } else {
      console.error('Failed to get login URL');
      this.config.onError?.();
    }
  }
} 