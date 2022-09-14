import { ClientError, NblocksErrorData } from "./ClientError";

export class NotFoundError extends ClientError {
    constructor(data: NblocksErrorData) {
        super(data, 404);
    }
}