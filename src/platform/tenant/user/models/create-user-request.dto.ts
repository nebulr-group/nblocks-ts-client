export class CreateUserRequestDto {
    /** Email address to the new user */
    username: string;
  
    /** The role must be present in App.roles */
    role: string;
  
    firstName?: string;
    lastName?: string;
}