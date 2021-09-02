/**
 * @interface UserBase
 * user entity base interface
 */
export interface UserBase {
  user_email: string;
  user_password: string;
  user_account_type: 'local' | 'kakao' | 'apple';
  user_nickname: string;
  user_birthday: Date;
  user_phone: string;
  user_marketing_agree: boolean;
}
