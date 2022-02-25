import { ClientError } from "./ClientError";

export class ForbiddenError extends ClientError {
    constructor(data: {message: string, error: string}) {
        super(403, data);
    }
}