import { MFAState } from "./mfa-state";

export class AuthenticateResponseDto {
  /** Auth token to include in every call the user makes */
  token!: string;

  /** This property tells if user expects to authenticate with MFA or not. Possible values: DISABLED, REQUIRED, SETUP */
  mfaState: MFAState;
}
