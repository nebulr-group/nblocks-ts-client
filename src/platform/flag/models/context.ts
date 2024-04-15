
export class UserContext {
    /** This is reserved for Nblocks users */
    id?: string;

    /** This is an arbitrary key. Use this anyway you like to match future calls */
    key?: string;

    /** This is the user role. Use this anyway you like to match future calls */
    role?: string;

    /** This is a placeholder for User name. Use this anyway you like to match future calls */
    name?: string;
}

export class OrgContext {

    /** This is reserved for Nblocks tenants */
    id?: string;


    /** This is an arbitrary key. Use this anyway you like to match future calls */
    key?: string;


    /** This is the org plan. Use this anyway you like to match future calls */
    plan?: string;


    /** This is a placeholder for tenant name. Use this anyway you like to match future calls */
    name?: string;
}


export class KeyContext {

    /** This is an arbitrary key. Use this anyway you like to match future calls */
    key?: string;
}


export class Context {

    /** Match on user */
    user?: UserContext;


    /** Match on organizations */
    org?: OrgContext;


    /** Match on devices */
    device?: KeyContext;
}


export class BodyWithCtxAndToken {
    context?: Context;
    accessToken?: string;
}