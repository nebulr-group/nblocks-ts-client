/**
 * The request is missing or has an invalid App api token
 */
export class AppUnauthenticatedError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}