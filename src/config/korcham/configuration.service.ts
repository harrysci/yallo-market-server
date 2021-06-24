import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * 한국 유통상품 DB app key값 가져오기
 * @class env method 집합 (harry)
 */

@Injectable()
export class KorchamConfigService {
  constructor(private configService: ConfigService) {}
  get appkey(): string {
    return this.configService.get<string>('korcham.appkey');
  }
  get apiurl(): string {
    return this.configService.get<string>('korcham.apiurl');
  }
}
