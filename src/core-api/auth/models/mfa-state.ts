export enum MFAState {
    DISABLED = "DISABLED", // A MFA value is not required to be present. User is currently authenticated/authorized
    REQUIRED = "REQUIRED", // A MFA value is required for the user to be authenticated/authorized
    SETUP = "SETUP", // The user is currently setting up MFA, state will goto REQUIRED once setup is completed. User will not be authenticated/authorized during this phase and can just call certain endpoints.
}