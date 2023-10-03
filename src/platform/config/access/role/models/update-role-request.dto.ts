export class UpdateRoleRequestDto {
  name?: string;
  key?: string;
  description?: string;
  privileges?: string[];
  isDefault?: boolean;
}