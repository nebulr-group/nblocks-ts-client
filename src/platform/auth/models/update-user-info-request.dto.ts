export class UpdateUserInfoRequestDto {
    authToken: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
}