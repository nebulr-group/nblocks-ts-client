export enum ParamType {
    EMAIL = 'email',
    PHONE = 'phone',
    NUMBER = 'number',
    INTEGER = 'integer',
    TEXT = 'text',
    FILE = 'file',
    REGEX = 'regex',
    BOOLEAN = 'boolean'
}



export class ParamConfig {
    label: string;    
    type: ParamType;
    userLabel: string;
    regex: string;
    
} 

//used on app config
export class CustomParamsConfig {
    id:string;
    params: ParamConfig[];
}


//used on tenant user creation
export class CustomParam extends ParamConfig {
    value: string;
}   

