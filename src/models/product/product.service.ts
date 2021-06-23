import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnsaleProduct } from './entities/onsale-product.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { Product } from './entities/product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';
import { KorchamConfigService } from '../../config/korcham/configuration.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProcessedProduct)
    private readonly processedProductRepository: Repository<ProcessedProduct>,

    @InjectRepository(WeightedProduct)
    private readonly weightedProductRepository: Repository<WeightedProduct>,

    @InjectRepository(OnsaleProduct)
    private readonly onSaleProductRepository: Repository<OnsaleProduct>,

    private httpService: HttpService,
    private korchamConfig: KorchamConfigService,
  ) {}

  /*
  ************************************************
  한국 유통DB에 바코드정보 조회 메서드
  ************************************************
  메서드 입력값 : 바코드정보(barcode: string)
  메서드동작 :  korcham API 에 GET요청후 리턴값반환
  - KorchamAPI -
    request: GET.
    header : Content-Type, yallomarket appkey,
    url: korchamurl/{barcode},
  메서드 반환값 : -notion db명세 참조 (AxiosRequest<Dto>)
  ************************************************
  */
  private async requestKorchamApi(barcode: string): Promise<any> {
    const headerRequest = new Headers();
    headerRequest.append('Content-Type', 'application/json:charset=utf-8');
    headerRequest.append(
      'Authorization',
      `appkey: ${this.korchamConfig.appkey}`,
    );

    return await this.httpService.get(
      `${this.korchamConfig.apiurl}/${barcode}`,
      {
        headers: headerRequest,
      },
    );
  }
}
