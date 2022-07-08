export type NblocksErrorData = {statusCode?: number, message: string, error: string};
export class ClientError extends Error {
    httpStatus:number;
    errorCode:string;
    details: NblocksErrorData;

    constructor(data: NblocksErrorData | string, httpStatus?: number, ) {
        if(typeof data === 'string') {
            super(data);
            this.httpStatus = httpStatus ? httpStatus : 0;
        } else {
            super(data.message);
            this.errorCode = data.error;
            this.details = data;
            this.httpStatus = httpStatus ? httpStatus : data.statusCode;
        }
        
    }
}