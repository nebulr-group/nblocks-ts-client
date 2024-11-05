export interface ILogger {
  log(message: string, emphasize?: boolean): void;
  logError(...data: any[]): void;
} 