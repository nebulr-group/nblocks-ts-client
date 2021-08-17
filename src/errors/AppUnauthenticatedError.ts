export class AppUnauthenticatedError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}