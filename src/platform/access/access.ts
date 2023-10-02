import { Entity } from '../../abstracts/generic-entity';
import { Privilege } from './privilege/privilege';
import { Role } from './role/role';
import { Roles } from './role/roles';
import { Privileges } from './privilege/privileges';

/**
 * A specific `Access` client for managing roles and privileges. 
 * Use this client to query or mutate data for a particular tenant
 */
export class Access extends Entity{

  readonly roles: Roles;
  readonly privileges: Privileges;

  constructor (parentEntity: Entity, debug = false) {
    super(parentEntity, debug);

    this.roles = new Roles(this, this.debug);
    this.privileges = new Privileges(this, this.debug);
  }

  /** Gets specific role */
  role(roleId: string): Role {
    return new Role(this, roleId, this.debug);
  }

  /** Gets specific privilege */
  privilege(privilegeId: string): Privilege {
    return new Privilege(this, privilegeId, this.debug);
  }

}