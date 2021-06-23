import { IsString } from 'class-validator';

export class distributePrdDto {
  @IsString()
  gtin: string;

  @IsString()
  prdNm: string;

  @IsString()
  prdImgUrl: string;

  @IsString()
  kanCode: string;

  @IsString()
  clsNm: string;

  @IsString()
  prdNmEng: string;

  @IsString()
  itmNm: string;

  @IsString()
  modelNm: string;

  @IsString()
  cpnInfo: string;

  @IsString()
  brandNm: string;

  @IsString()
  countries: string[];

  @IsString()
  prdComp: string;

  @IsString()
  originVolume: string;

  @IsString()
  prdPacType: string;
}
