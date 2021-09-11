export type EmailDupleCheckResType =
  | 'NOT_EXIST'
  | 'EXIST_OTHER_TYPE'
  | 'SUCCESS';

import { IsEmail, IsString } from 'class-validator';

export class EmailDupleCheckRes {
  @IsString()
  readonly checkResult: EmailDupleCheckResType;

  @IsEmail()
  readonly existEmail?: string;

  @IsString()
  readonly type?: 'local' | 'kakao' | 'apple';

  @IsString()
  access_token?: string;
}
