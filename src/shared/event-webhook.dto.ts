export class EventWebhookDto {
    event: WebhookEventType;
    data: unknown;
}

export enum WebhookEventType {
    TENANT_CREATED = 'TENANT_CREATED'
}