export class UnauthenticatedError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}