import { PrivilegeResponseDto } from '../../privilege/models/privilege-response.dto';

/**
 * Every user is assigned one role which is a collection of privileges that grants varying access to Nblocks and the client app. 
 */
export class RoleResponseDto {

  /** Logical id reference to this instance */
  id: string;

  /** Name of the role */
  name: string;

  /** The key of the role, used for reference in client apps */
  key: string;

  /** An optional description of the role */
  description?: string;

  /** Collection of connected privileges   */
  privileges: PrivilegeResponseDto[];

  /** Default role status */
  isDefault: boolean;

}
