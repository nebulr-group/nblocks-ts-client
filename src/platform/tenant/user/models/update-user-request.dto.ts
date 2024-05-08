export class UpdateUserRequestDto {
  /** The role key. Must exists as a Role */
  role?: string;

  /** Enable / Disable access to your app */
  enabled?: boolean;
  
  /** Organize the user into teams with key identifiers */
  teams?: string[];
  
  /** User's first name */
  firstName?: string;
  
  /** User's last name */
  lastName?: string;
  
  /** User's phone number */
  phoneNumber?: string;
  
  /** Mark user as onboarded */
  onboarded?: boolean;
  
  /** Mark user has consent to your privacy policy */
  consentsToPrivacyPolicy?: boolean;
}
