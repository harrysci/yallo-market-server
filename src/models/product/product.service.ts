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

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

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

    // 유통상품지식뱅크 DB 조회에 따른 return 처리 안함.

    const storeIdName: StoreIdNameRes =
      await this.storeService.getStoreIdNameByOwnerId(ownerId);
    // ownerId 에 해당하는 store 가 존재하지 않는 경우
    if (storeIdName == undefined) return null;

    const isPresent = await this.productRepository
      .createQueryBuilder('product')
      .where('product.store=:storeId', { storeId: storeIdName.storeId })
      .andWhere('product.product_barcode=:barcode', { barcode: barcode })
      .getOne();
    // ownerId 에 해당하는 store 에 해당 barcode 의 상품이 존재하지 않는 경우
    if (isPresent == undefined) return null;

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

    const productImageList: ProductImage[] = rawProductImageList.product_image;

    const barcodeProductInfo: GetBarcodeProductRes = !rawBarcodeProductInfo
      ? null
      : {
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
            ? rawBarcodeProductInfo.processed_product.processed_product_volume
            : rawBarcodeProductInfo.weighted_product.weighted_product_volume,
          productImages: rawProductImageList ? productImageList : null,
        };

    return barcodeProductInfo;
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

  /**
   * 바코드를 통한 상품 정보 삭제
   * @param ownerId
   * @param barcode
   * @return rawProduct
   */
  async deleteBarcodeProduct(
    ownerId: number,
    barcode: string,
  ): Promise<Product> {
    /**
     * 1. owner 테이블과 store 테이블 간 left join -> storeId 조회
     * 2. product 테이블에서 storeId 와 barcode 를 통해 select
     * 3. product 테이블에 해당 상품이 존재하는 경우 상품을 삭제한 뒤 함수를 종료한다.
     */

    const storeIdName: StoreIdNameRes =
      await this.storeService.getStoreIdNameByOwnerId(ownerId);
    // ownerId 에 해당하는 store 가 존재하지 않는 경우
    if (!storeIdName)
      throw new Error(
        `[deleteBarcodeProduct Error] no store was found by owner_id: ${ownerId}`,
      );

    const rawProduct: Product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.store=:storeId', { storeId: storeIdName.storeId })
      .andWhere('product.product_barcode=:barcode', { barcode: barcode })
      .leftJoinAndSelect('product.product_image', 'product_image')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .getOne();

    try {
      // product_image 테이블에서 상품 이미지 삭제
      if (rawProduct.product_image.length)
        await this.productImageRepository
          .createQueryBuilder('product_image')
          .delete()
          .from(ProductImage)
          .where('product_image.product_id=:productId', {
            productId: rawProduct.product_id,
          })
          .execute();

      // product 테이블에서 상품 삭제
      await this.productRepository.remove(rawProduct);

      // processed_product 테이블에서 공산 식품 상세정보 삭제
      if (rawProduct.processed_product) {
        const deleteTarget: ProcessedProduct =
          await this.processedProductRepository.findOne({
            processed_product_id:
              rawProduct.processed_product.processed_product_id,
          });

        await this.processedProductRepository.remove(deleteTarget);
      }

      // weighted_product 테이블에서 저울 식품 상세정보 삭제
      if (rawProduct.weighted_product) {
        const deleteTarget: WeightedProduct =
          await this.weightedProductRepository.findOne({
            weighted_product_id:
              rawProduct.weighted_product.weighted_product_id,
          });

        await this.weightedProductRepository.remove(deleteTarget);
      }

      // onsale_product 테이블에서 상품 할인정보 삭제
      if (rawProduct.onsale_product) {
        const deleteTarget: OnsaleProduct =
          await this.onSaleProductRepository.findOne({
            onsale_product_id: rawProduct.onsale_product.onsale_product_id,
          });

        await this.onSaleProductRepository.remove(deleteTarget);
      }
    } catch {
      throw new Error('[deleteBarcodeProduct Error] delete error');
    }

    return rawProduct;
  }
}
