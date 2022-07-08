import { ClientError, NblocksErrorData } from "./ClientError";

export class UnauthenticatedError extends ClientError {
    constructor(data: NblocksErrorData) {
        super(data, 401);
    }
}