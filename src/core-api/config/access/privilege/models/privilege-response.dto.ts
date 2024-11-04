// Privileges grants access to specific fetaures in Nblocks and the client apps
export class PrivilegeResponseDto {
  /** Logical id reference to this instance */
  id: string;

  /** The key of the privilege, used for reference in client apps*/
  key: string;

  /** An optional description of the privilege */
  description?: string;

}
