export class CreatePrivilegeRequestDto {
  /** The key of the privilege, used for reference in client apps*/  
  key: string;
  
  /** An optional description of the privilege */
  description?: string;
}  