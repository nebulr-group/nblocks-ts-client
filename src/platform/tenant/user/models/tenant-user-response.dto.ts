import { TenantResponseDto } from "../../models/tenant.model";

export class TenantUserResponseDto {
    /**
     * Shared properties with AuthTenantUserResponseDto
     */
    /** Unique ID */
    id: string;
  
    /** Role of the user. Grants a set of privileges. Privileges are configured on the `App` model. */
    role: string;
  
    /** Email address, same as username ATM */
    email: string;
  
    /** Username, same as Email address ATM */
    username: string;
  
    /** Users first name */
    firstName: string;

    /** Users last name */
    lastName: string;

    /** Users full name (first name and last name concatenated) */
    fullName: string;
  
    /** If user is onboarded or not (should be put through app onboarding) */
    onboarded: boolean;

    /** If user have left consent to the app privacy policy or not (should be set during app onboarding) */
    consentsToPrivacyPolicy: boolean;
  
    /**
     * Custom properties different from AuthTenantUserResponseDto
     */
    /** Link this user to one or many teams / groups of other users */
  
    /** If user should be allowed to login or not */
    enabled: boolean;
  
    /** Array of identifiers that can be used to group several users into teams or groups */
    teams: string[];
  
    /** Date when the user was created */
    createdAt: Date;
  
    /** Users tenant */
    tenant: TenantResponseDto
  }