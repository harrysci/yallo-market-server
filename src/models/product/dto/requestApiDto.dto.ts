import { IsString } from 'class-validator';

export class requestApiDto {
  @IsString()
  appKey: string;
}
