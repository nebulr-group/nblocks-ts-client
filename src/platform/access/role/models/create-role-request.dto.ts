export class CreateRoleRequestDto {
  /** Human-readable name of the role*/  
  name: string;

  /** A unique key of the role, used for reference in client apps*/  
  key: string;

  /** An optional description of the role */
  description?: string;

  /** A list if privileges ids that should be connected to the role */
  privileges: string[];

  /** If the roles should be the default role for new users. Only one role can be default */
  isDefault: boolean;
}  