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
} 

export class CustomParamsConfig {
    id:string;
    params: ParamConfig[];
}

