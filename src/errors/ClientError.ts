export class ClientError extends Error {
    httpStatus:number;
    errorCode:string;

    constructor(httpStatus: number, data: {message: string, error: string} | string) {
        if(typeof data === 'string') {
            super(data);
        } else {
            super(data.message);
            this.errorCode = data.error;
        }
        this.httpStatus = httpStatus;
    }
}