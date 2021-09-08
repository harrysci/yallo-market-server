import { IsBoolean, IsDate, IsEmail, IsString } from 'class-validator';

export class CreateSocialUserReq {
  @IsEmail()
  readonly user_email: string;

  @IsString()
  readonly user_password: string;

  @IsString()
  readonly user_account_type: 'local' | 'kakao' | 'apple';

  @IsString()
  readonly user_nickname: string;

  @IsDate()
  readonly user_birthday: Date;

  @IsString()
  readonly user_phone: string;

  @IsString()
  readonly user_address: string;

  @IsBoolean()
  readonly user_marketing_agree: boolean;
}
