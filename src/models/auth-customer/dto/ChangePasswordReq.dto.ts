import { IsEmail, IsString } from 'class-validator';

export class ChangePasswordReq {
  @IsEmail()
  readonly user_email: string;

  @IsString()
  readonly user_password: string;
}
