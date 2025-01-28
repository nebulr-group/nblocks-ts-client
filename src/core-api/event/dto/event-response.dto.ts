export class EventResponseDto {
    id: string;
    eventName: string;
    timestamp: Date;
    appId: string;
    userId?: string;
    tenantId?: string;
} 