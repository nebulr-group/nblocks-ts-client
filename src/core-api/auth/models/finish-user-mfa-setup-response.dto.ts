export class FinishUserMfaSetupResponseDto {
  constructor(
    public mfaToken: string,
    public backupCode: string
  ) { }
}