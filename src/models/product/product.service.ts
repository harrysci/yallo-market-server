import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreService } from '../store/store.service';
import { CreateBarcodeProcessedProductDto } from './dto/CreateBarcodeProcessedProductDto.dto';
import { CreateBarcodeWeightedProductDto } from './dto/CreateBarcodeWeightedProductDto.dto';
import { GetBarcodeProductRes } from './dto/GetBarcodeProductRes.dto';
import { OnsaleProduct } from './entities/onsale-product.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { Product } from './entities/product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';

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

    private readonly storeService: StoreService,
  ) {}

  async createBarcodeProcessedProduct(
    ownerId: number,
    productData: CreateBarcodeProcessedProductDto,
  ): Promise<any> {
    /**
     * 1.
     * 2.
     * 3.
     */
  }

  async createBarcodeWeightedProduct(
    ownerId: number,
    productData: CreateBarcodeWeightedProductDto,
  ): Promise<any> {
    /**
     * 1.
     * 2.
     * 3.
     */
  }

  /**
   *
   * @param ownerId
   * @param barcode
   * @returns
   */
  async getBarcodeProductInfo(ownerId: number, barcode: string): Promise<any> {
    // ): Promise<GetBarcodeProductRes | boolean> {
    /**
     * 1. owner 테이블과 store 테이블 간 left join -> storeId 조회
     * 2. product 테이블에서 storeId 와 barcode 를 통해 select
     * 3. product 테이블에 해당 상품이 존재하는 경우
     *  -> @return barcodeProductInfo
     * 4. product 테이블에 해당 상품이 존재하지 않는 경우
     *  -> 유통상품지식뱅크 DB에 해당 상품이 존재하는 경우 @return true
     *  -> 유통상품지식뱅크 DB에 해당 상품이 존재하지 않는 경우 @return false
     */

    const storeName: string | null =
      await this.storeService.getStoreNameByOwnerId(ownerId);

    if (storeName == null) return null;
    else {
      const rawBarcodeProductInfo = await this.productRepository
        .createQueryBuilder('product')
        .where('product.store=:storeName', { storeName: storeName })
        .andWhere('product.product_barcode=:barcode', { barcode: barcode })
        .getOne();

      const barcodeProductInfo: GetBarcodeProductRes =
        rawBarcodeProductInfo == undefined
          ? null
          : {
              storeName: rawBarcodeProductInfo.store,
            };

      return rawBarcodeProductInfo;
    }
  }

  async updateBarcodeProductInfo(
    ownerId: number,
    barcode: string,
  ): Promise<any> {
    /**
     * 1.
     * 2.
     * 3.
     */
  }

  async deleteBarcodeProduct(ownerId: number, barcode: string): Promise<any> {
    /**
     * 1.
     * 2.
     * 3.
     */
  }
}
