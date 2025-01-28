export interface TokenExpirationConfig {
  getTokenExpiration: (token: string) => number;
}

export class TokenManager {
  private storage: Storage;
  private tokens: {
    access?: string;
    id?: string;
    refresh?: string;
  } = {};
  private expirationConfig?: TokenExpirationConfig;

  private listeners: Map<string, Set<(value: string | undefined) => void>> = new Map();

  constructor(storage: Storage = localStorage, expirationConfig?: TokenExpirationConfig) {
    this.storage = storage;
    this.expirationConfig = expirationConfig;
    this.loadTokensFromStorage();
  }

  subscribe(tokenType: 'access' | 'id' | 'refresh', callback: (value: string | undefined) => void): () => void {
    const listeners = this.listeners.get(tokenType) || new Set();
    listeners.add(callback);
    this.listeners.set(tokenType, listeners);
    
    // Initial callback with current value
    callback(this.tokens[tokenType]);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(tokenType);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  setToken(type: 'access' | 'id' | 'refresh', token: string | undefined): void {
    const key = `NB_${type.toUpperCase()}_TOKEN`;
    this.tokens[type] = token;
    this.saveTokenToStorage(key, token);
    
    // Notify listeners
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.forEach(callback => callback(token));
    }
  }

  getToken(type: 'access' | 'id' | 'refresh'): string | undefined {
    return this.tokens[type];
  }

  destroyTokens(): void {
    this.setToken('access', undefined);
    this.setToken('id', undefined);
    this.setToken('refresh', undefined);
  }

  clearExpiredTokens(): void {
    if (!this.expirationConfig) {
      return;
    }

    const now = new Date().getTime();

    // Check refresh token first
    if (this.tokens.refresh && 
        now > this.expirationConfig.getTokenExpiration(this.tokens.refresh) * 1000) {
      this.setToken('refresh', undefined);
    }

    // Then check access token
    if (this.tokens.access && 
        now > this.expirationConfig.getTokenExpiration(this.tokens.access) * 1000) {
      this.setToken('access', undefined);
    }
  }

  private loadTokensFromStorage(): void {
    this.setToken('access', this.storage.getItem('NB_ACCESS_TOKEN') || undefined);
    this.setToken('id', this.storage.getItem('NB_ID_TOKEN') || undefined);
    this.setToken('refresh', this.storage.getItem('NB_REFRESH_TOKEN') || undefined);
  }

  private saveTokenToStorage(key: string, token: string | undefined): void {
    if (token) {
      this.storage.setItem(key, token);
    } else {
      this.storage.removeItem(key);
    }
  }
} 