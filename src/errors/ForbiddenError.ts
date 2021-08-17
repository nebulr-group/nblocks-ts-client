export class ForbiddenError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}