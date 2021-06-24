import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreIdNameRes } from '../store/dto/StoreIdNameRes.dto';
import { StoreService } from '../store/store.service';
import { CreateBarcodeProcessedProductDto } from './dto/CreateBarcodeProcessedProductDto.dto';
import { CreateBarcodeWeightedProductDto } from './dto/CreateBarcodeWeightedProductDto.dto';
import { GetBarcodeProductRes } from './dto/GetBarcodeProductRes.dto';
import { OnsaleProduct } from './entities/onsale-product.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { ProductImage } from './entities/product-image.entity';
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
   * 바코드를 통한 상품 정보 조회
   * @param ownerId
   * @param barcode
   * @return barcodeProductInfo
   */
  async getBarcodeProductInfo(
    ownerId: number,
    barcode: string,
  ): Promise<GetBarcodeProductRes> {
    /**
     * 1. owner 테이블과 store 테이블 간 left join -> storeId 조회
     * 2. product 테이블에서 storeId 와 barcode 를 통해 select
     * 3. product 테이블에 해당 상품이 존재하는 경우
     *  -> @return barcodeProductInfo
     * 4. product 테이블에 해당 상품이 존재하지 않는 경우
     *  -> 유통상품지식뱅크 DB에 해당 상품이 존재하는 경우 @return true
     *  -> 유통상품지식뱅크 DB에 해당 상품이 존재하지 않는 경우 @return false
     */

    const storeIdName: StoreIdNameRes =
      await this.storeService.getStoreIdNameByOwnerId(ownerId);

    if (!storeIdName) return null;
    else {
      const rawBarcodeProductInfo = await this.productRepository
        .createQueryBuilder('product')
        .where('product.store=:storeId', { storeId: storeIdName.storeId })
        .andWhere('product.product_barcode=:barcode', { barcode: barcode })
        .leftJoinAndSelect('product.processed_product', 'processed_product')
        .leftJoinAndSelect('product.weighted_product', 'weighted_product')
        .leftJoinAndSelect('product.onsale_product', 'onsale_product')
        .getOne();

      const rawProductImageList = await this.productRepository
        .createQueryBuilder('product')
        .where('product.store=:storeId', { storeId: storeIdName.storeId })
        .andWhere('product.product_barcode=:barcode', { barcode: barcode })
        .leftJoinAndSelect('product.product_image', 'product_image')
        .getOne();

      const productImageList: ProductImage[] =
        rawProductImageList.product_image;

      const barcodeProductInfo: GetBarcodeProductRes =
        storeIdName && rawBarcodeProductInfo
          ? {
              storeName: storeIdName.storeName,
              productName: rawBarcodeProductInfo.product_name,
              productBarcode: rawBarcodeProductInfo.product_barcode,
              productCurrentPrice: rawBarcodeProductInfo.product_current_price,
              productOnsale: rawBarcodeProductInfo.product_onsale,
              productOnsalePrice: rawBarcodeProductInfo.onsale_product
                ? rawBarcodeProductInfo.onsale_product.product_onsale_price
                : null,
              productCategory: rawBarcodeProductInfo.product_category,
              productCreatedAt: rawBarcodeProductInfo.product_created_at,
              productVolume: rawBarcodeProductInfo.processed_product
                ? rawBarcodeProductInfo.processed_product
                    .processed_product_volume
                : rawBarcodeProductInfo.weighted_product
                    .weighted_product_volume,
              productImages: rawProductImageList ? productImageList : null,
            }
          : null;

      return barcodeProductInfo;
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
