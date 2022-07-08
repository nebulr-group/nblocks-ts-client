import { ClientError, NblocksErrorData } from "./ClientError";

export class ForbiddenError extends ClientError {
    constructor(data: NblocksErrorData) {
        super(data, 403);
    }
}