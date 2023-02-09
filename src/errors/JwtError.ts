export class JwtError extends Error {
    constructor() {
        super("The JWT wasn't verified and thus this data can not be trusted");
    }
}