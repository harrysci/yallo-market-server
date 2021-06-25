import { IsString, IsNumber } from 'class-validator';

export class postProductDto {
  @IsString()
  prdNamd: string;
}
