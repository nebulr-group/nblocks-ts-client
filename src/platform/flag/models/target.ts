
export class TargetValue {
  operator:
    | 'eq'
    | 'beginsWith'
    | 'endsWith'
    | 'contains'
    | 'lowerThan'
    | 'greaterThan';

  value: string;
}

export class UserTarget {
  /** This is reserved for Nblocks users */
  
  id?: string;

  /** This is an arbitrary key. Use this anyway you like to match future calls */
  key?: TargetValue;

  /** This is the user role. Use this anyway you like to match future calls */
  role?: TargetValue;

  /** This is a placeholder for User name. Use this anyway you like to match future calls */
  name?: TargetValue;

  /** This is aplaceholder for User email. Use this anyway you like to match future calls */
  email?: string;
}

export class TenantTarget {
  /** This is reserved for Nblocks tenants */
  id?: string;

  /** This is an arbitrary key. Use this anyway you like to match future calls */
  key?: TargetValue;

  /** This is the org plan. Use this anyway you like to match future calls */
  plan?: TargetValue;

  /** This is a placeholder for tenant name. Use this anyway you like to match future calls */
  name?: TargetValue;
}

export class KeyTarget {
  /** This is an arbitrary key. Use this anyway you like to match future calls */
  key?: TargetValue;
}

export class Target {
  /** Match on user */
  user?: UserTarget;

  /**
   * Match on tenants
   * @deprecated use tenant instead
   */
  org?: TenantTarget;

  /** Match on tenants */
  tenant?: TenantTarget;

  /** Match on devices */
  device?: KeyTarget;

  /** Match on custom targets */
  custom?: CustomTargets;
}

interface CustomTargets {
  [key: string]: TargetValue;
}
