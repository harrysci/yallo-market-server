import { IsEmail, IsString } from 'class-validator';

export class LocalLoginReq {
  @IsEmail()
  readonly user_email: string;

  @IsString()
  readonly user_password: string;
}
