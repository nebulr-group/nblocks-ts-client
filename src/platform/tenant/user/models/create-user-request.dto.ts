export class CreateUserRequestDto {
    /** Email address to the new user */
    username: string;
  
    /** The role must be present in App.roles */
    role?: string;
  
    /** User's first name */
    firstName?: string;

    /** User's last name */
    lastName?: string;

    /** Set this variable to true if you don't wish to send out any notifications to the user */
    muteNotifications?: boolean;
}