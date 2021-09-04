export class CreateLocalUserRes {
  user_email: string;
  user_account_type: 'local' | 'kakao' | 'apple';
  user_nickname: string;
  user_birthday: Date;
  user_phone: string;
  user_address: string;
  user_marketing_agree: boolean;
}
