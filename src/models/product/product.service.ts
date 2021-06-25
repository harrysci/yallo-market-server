import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreIdNameRes } from '../store/dto/StoreIdNameRes.dto';
import { StoreService } from '../store/store.service';
import { GetBarcodeProductRes } from './dto/GetBarcodeProductRes.dto';
import { GetProductListRes } from './dto/getProductListRes.dto';
import { UpdateProductInfoReq } from './dto/updateProductInfoReq.dto';
import { UpdateProductInfoRes } from './dto/updateProductInfoRes.dto';
import { OnsaleProduct } from './entities/onsale-product.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';
import { KorchamConfigService } from '../../config/korcham/configuration.service';
import { updateBarcodeProductInfoReq } from './dto/updateBarcodeProductInfoReq.dto';
import { UpdateBarcodeProductInfoRes } from './dto/updateBarcodeProductInfoRes.dto';
import { CreateBarcodeProcessedProductReq } from './dto/CreateBarcodeProcessedProductReq.dto';
import { CreateBarcodeWeightedProductRes } from './dto/CreateBarcodeWeightedProductRes.dto';
import { CreateBarcodeProcessedProductRes } from './dto/CreateBarcodeProcessedProductRes.dto';
import { CreateBarcodeWeightedProductReq } from './dto/CreateBarcodeWeightedProductReq.dto';
import { StoreBase } from '../store/interfaces/store-base.interface';

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
    private readonly httpService: HttpService,
    private readonly korchamConfig: KorchamConfigService,
  ) {}

  /**
   * 바코드를 통한 공산품 생성
   * @param ownerId
   * @param productData
   * @return createdProduct
   */
  async createBarcodeProcessedProduct(
    ownerId: number,
    productData: CreateBarcodeProcessedProductReq,
  ): Promise<CreateBarcodeProcessedProductRes> {
    /**
     * 1.
     * 2.
     * 3.
     */

    const createdProduct: CreateBarcodeProcessedProductRes = null;

    return createdProduct;
  }

  /**
   * 바코드를 통한 저울 상품 생성
   * @param ownerId
   * @param productData
   * @return createdProduct
   */
  async createBarcodeWeightedProduct(
    ownerId: number,
    productData: CreateBarcodeWeightedProductReq,
  ): Promise<CreateBarcodeWeightedProductRes> {
    /**
     * 1.
     * 2.
     * 3.
     */

    const storeIdName: StoreIdNameRes =
      await this.storeService.getStoreIdNameByOwnerId(ownerId);
    // ownerId 에 해당하는 store 가 존재하지 않는 경우
    if (!storeIdName)
      throw new Error(
        `[createBarcodeWeightedProduct Error] no store was found by owner_id: ${ownerId}`,
      );

    const store: Store = await this.storeService.getStore(storeIdName.storeId);
    const createdProduct: Product = {
      // store_id: storeIdName.storeId,
      product_barcode: productData.productBarcode,
      product_name: productData.productName,
      product_original_price: productData.productOriginPrice,
      product_current_price: productData.productCurrentPrice,
      product_profit:
        ((productData.productCurrentPrice - productData.productOriginPrice) /
          productData.productCurrentPrice) *
        100,
      product_description: productData.productDescription,
      product_is_processed: productData.productIsProcessed,
      product_is_soldout: productData.productIsSoldout,
      product_onsale: false,
      product_category: null,
      product_created_at: productData.productCreatedAt,
      product_image: null,

      store: null,
      onsale_product: null,
      processed_product: null,
      weighted_product: null,
    };

    return createdProduct;
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

  /**
   * 바코드를 통한 상품 정보 갱신
   * @param ownerId
   * @param barcode
   * @return updatedProduct
   */
  async updateBarcodeProductInfo(
    ownerId: number,
    barcode: string,
    updateProductInfo: updateBarcodeProductInfoReq,
  ): Promise<UpdateBarcodeProductInfoRes> {
    /**
     * 1. owner 테이블과 store 테이블 간 left join -> storeId 조회
     * 2. product 테이블에서 storeId 와 barcode 를 통해 select
     * 3. product 테이블에 해당 상품이 존재하는 경우 updateProductInfo 로 전달받은 정보를 갱신
     * 4. 갱신한 상품을 product 테이블에서 조회하여 그 결과값을 반환하며 함수를 종료
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
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .getOne();
    if (!rawProduct)
      throw new Error(
        `[updateBarcodeProductInfo Error] no product was found by owner_id: ${ownerId}, store_id: ${storeIdName.storeId}, product_barcode: ${barcode}`,
      );

    // rawProduct 공산품 정보(updateProductInfo.processed_product) 수정
    if (rawProduct.processed_product) {
      rawProduct.processed_product = {
        ...rawProduct.processed_product,
        processed_product_volume: updateProductInfo.productVolume,
      };
    }
    // rawProduct 저울상품 정보(updateProductInfo.weighted_product) 수정
    else {
      rawProduct.weighted_product = {
        ...rawProduct.weighted_product,
        weighted_product_volume: updateProductInfo.productVolume,
      };
    }

    try {
      // 공산품 정보, 저울상품 정보, 상품 할인 정보 수정 내역 적용
      await this.productRepository.save(rawProduct);

      // 상품 정보 수정
      await this.productRepository
        .createQueryBuilder('product')
        .update(Product)
        .where('product.product_id=:productId', {
          productId: updateProductInfo.productId,
        })
        .set({
          product_barcode: updateProductInfo.productBarcode,
          product_name: updateProductInfo.productName,
          product_current_price: updateProductInfo.productCurrentPrice,
          product_category: updateProductInfo.productCategory,
          product_created_at: updateProductInfo.productCreatedAt,
          product_is_soldout: updateProductInfo.productIsSoldout,
          product_original_price: updateProductInfo.productOriginPrice,
          product_description: updateProductInfo.productDescription,
          product_profit: rawProduct.product_onsale
            ? // 상품이 할인 중인 경우
              ((rawProduct.onsale_product.product_onsale_price -
                updateProductInfo.productOriginPrice) /
                rawProduct.onsale_product.product_onsale_price) *
              100
            : // 상품이 할인 중이지 않은 경우
              ((updateProductInfo.productCurrentPrice -
                updateProductInfo.productOriginPrice) /
                updateProductInfo.productCurrentPrice) *
              100,
        })
        .execute();

      // 수정된 상품 정보 조회
      const rawUpdatedProduct: Product = await this.productRepository
        .createQueryBuilder('product')
        .where('product.product_id = :productId', {
          productId: updateProductInfo.productId,
        })
        .leftJoinAndSelect('product.processed_product', 'processed_product')
        .leftJoinAndSelect('product.weighted_product', 'weighted_product')
        .getOne();

      console.log(rawUpdatedProduct);

      const updatedProduct: UpdateBarcodeProductInfoRes = {
        productId: rawUpdatedProduct.product_id,
        productIsProcessed: rawUpdatedProduct.product_is_processed,
        productBarcode: rawUpdatedProduct.product_barcode,
        productName: rawUpdatedProduct.product_name,
        productCurrentPrice: rawUpdatedProduct.product_current_price,
        productCategory: rawUpdatedProduct.product_category,
        productCreatedAt: rawUpdatedProduct.product_created_at,
        productVolume: rawUpdatedProduct.product_is_processed
          ? rawUpdatedProduct.processed_product.processed_product_volume
          : rawUpdatedProduct.weighted_product.weighted_product_volume,
        productIsSoldout: rawUpdatedProduct.product_is_soldout,
        productOriginPrice: rawUpdatedProduct.product_original_price,
        productDescription: rawUpdatedProduct.product_description,
      };

      console.log(updatedProduct);

      return updatedProduct;
    } catch {
      throw new Error(
        `[updateBarcodeProductInfo Error] update error by ${ownerId}, store_id: ${storeIdName.storeId}, product_barcode: ${barcode}`,
      );
    }
  }

  /**
   * 바코드를 통한 상품 정보 삭제
   * @param ownerId
   * @param barcode
   * @return rawProduct (삭제한 상품 정보)
   */
  async deleteBarcodeProduct(
    ownerId: number,
    barcode: string,
  ): Promise<Product> {
    /**
     * 1. owner 테이블과 store 테이블 간 left join -> storeId 조회
     * 2. product 테이블에서 storeId 와 barcode 를 통해 select
     * 3. product 테이블에 해당 상품이 존재하는 경우 상품을 삭제한 뒤 함수를 종료
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

  /**********************************************************************************
   * @점주WebApp
   **********************************************************************************/
  /**
   * 점주 및 점포 관리인 웹 대시보드 상품 목록 조회
   * @param storeId 가게 id
   * @returns GetProductListRes[], 웹 요청 상품 정보 리스트 반환
   * @추가error 존재하지 않는 store key 에 대해 throw error
   */
  async getProductList(storeId: number) {
    /* Database 조회 결과 */
    const selectProductListRawResult = await this.productRepository
      .createQueryBuilder('product')
      .where('product.store_id = :store_id', { store_id: storeId })
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .getMany();

    if (!selectProductListRawResult) {
      throw new Error('getProductList [Get] Not Exist store Key  ... ');
    }

    /* 점주 및 점포 관리인 WEB 상품 정보 리스트 조회 결과로 변환*/
    const productList: GetProductListRes[] =
      selectProductListRawResult.map<GetProductListRes>((eachProduct) => ({
        productId: eachProduct.product_id,
        productBarcode: eachProduct.product_barcode,
        productName: eachProduct.product_name,
        productOriginPrice: eachProduct.product_original_price,
        productCurrentPrice: eachProduct.product_current_price,
        productOnSalePrice: eachProduct.onsale_product
          ? eachProduct.onsale_product.product_onsale_price
          : eachProduct.product_current_price,
        productProfit: eachProduct.product_profit,
        productIsProcessed: eachProduct.product_is_processed,
        productOnSale: eachProduct.product_onsale,
        productVolume: eachProduct.product_is_processed
          ? eachProduct.processed_product.processed_product_volume
          : eachProduct.weighted_product.weighted_product_volume,
      }));

    return productList;
  }

  /**
   * 점주 및 점포 관리인 웹 대시보드 개별 상품 정보 수정
   * @param updateProductInfo 수정할 상품의 id 및 수정할 상품 정보
   * @returns UpdateProductInfoRes , 수정된 웹 요청 상품 정보 반환
   * @추가error 존재하지 않는 product key 에 대해 throw error
   */
  async updateProductInfo(
    updateProductInfo: UpdateProductInfoReq,
  ): Promise<UpdateProductInfoRes> {
    /* product id 를 통해 원본 데이터 조회 */
    const selectProductRawResult: Product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.product_id = :product_id', {
        product_id: updateProductInfo.productId,
      })
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .getOne();

    if (!selectProductRawResult) {
      throw new Error('updateProductInfo [Update] Not Exist product Key  ... ');
    }

    /**
     * 1. on sale product 정보 수정
     * 2. processed product 정보 수정
     * 3. weighted product 정보 수정
     */
    if (selectProductRawResult.onsale_product) {
      selectProductRawResult.onsale_product = {
        ...selectProductRawResult.onsale_product,
        product_onsale_price: updateProductInfo.productOnSalePrice
          ? updateProductInfo.productOnSalePrice
          : updateProductInfo.productCurrentPrice,
      };
    }

    if (selectProductRawResult.processed_product) {
      selectProductRawResult.processed_product = {
        ...selectProductRawResult.processed_product,
        processed_product_volume: updateProductInfo.productVolume,
      };
    } else {
      selectProductRawResult.weighted_product = {
        ...selectProductRawResult.weighted_product,
        weighted_product_volume: updateProductInfo.productVolume,
      };
    }

    try {
      /* 수정한 정보 적용 */
      await this.productRepository.save(selectProductRawResult);

      /* product 정보 수정 */
      await this.productRepository
        .createQueryBuilder('product')
        .update(Product)
        .where('product.product_id = :product_id', {
          product_id: updateProductInfo.productId,
        })
        .set({
          product_barcode: updateProductInfo.productBarcode,
          product_name: updateProductInfo.productName,
          product_original_price: updateProductInfo.productOriginPrice,
          product_current_price: updateProductInfo.productCurrentPrice,
          product_profit: updateProductInfo.productProfit,
          product_onsale: updateProductInfo.productOnSale,
        })
        .execute();

      /* 수정된 DB 정보 조회 */
      const selectUpdatedProductRawResult: Product =
        await this.productRepository
          .createQueryBuilder('product')
          .where('product.product_id = :product_id', {
            product_id: updateProductInfo.productId,
          })
          .leftJoinAndSelect('product.onsale_product', 'onsale_product')
          .leftJoinAndSelect('product.weighted_product', 'weighted_product')
          .leftJoinAndSelect('product.processed_product', 'processed_product')
          .getOne();

      /* 점주 및 점포 관리인 상품 정보 수정 요청 결과로 변환 */
      const updatedProductInfo: UpdateProductInfoRes = {
        productId: selectUpdatedProductRawResult.product_id,
        productBarcode: selectUpdatedProductRawResult.product_barcode,
        productName: selectUpdatedProductRawResult.product_name,
        productOriginPrice:
          selectUpdatedProductRawResult.product_original_price,
        productCurrentPrice:
          selectUpdatedProductRawResult.product_current_price,
        productOnSalePrice: selectUpdatedProductRawResult.onsale_product
          ? selectUpdatedProductRawResult.onsale_product.product_onsale_price
          : selectUpdatedProductRawResult.product_current_price,
        productProfit: selectUpdatedProductRawResult.product_profit,
        productIsProcessed: selectUpdatedProductRawResult.product_is_processed,
        productOnSale: selectUpdatedProductRawResult.product_onsale,
        productVolume: selectUpdatedProductRawResult.product_is_processed
          ? selectUpdatedProductRawResult.processed_product
              .processed_product_volume
          : selectUpdatedProductRawResult.weighted_product
              .weighted_product_volume,
      };
      return updatedProductInfo;
    } catch {
      throw new Error('updateProductInfo [Update] Error');
    }
  }

  /**
   * 점주 및 점포 관리인 웹 대시보드 개별 상품 삭제 (on sale, processed, weighted 동시 삭제)
   * @param productId 삭제할 상품의 id
   * @returns void
   * @추가error 존재하지 않는 product key 에 대해 throw error
   */
  async deleteProductInfo(productId: number): Promise<void> {
    /* product id 를 통해 원본 데이터 조회 */
    const selectTargetProductRawResult: Product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.product_id = :product_id', { product_id: productId })
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .leftJoinAndSelect('product.product_image', 'product_image')
      .getOne();

    if (!selectTargetProductRawResult) {
      throw new Error('deleteProductInfo [Delete] Not Exist product Key  ... ');
    }

    try {
      /* 1. foreign key 의 대상(1:N) relation table raws 삭제 */
      if (selectTargetProductRawResult.product_image.length === 0) {
        await this.productImageRepository
          .createQueryBuilder('product_image')
          .delete()
          .where('product_image.product_id = :product_id', {
            product_id: selectTargetProductRawResult.product_id,
          })
          .execute();
      }

      /* 2. foreign key 를 가진 해당 product 삭제 */
      await this.productRepository.remove(selectTargetProductRawResult);

      /* 3. foreign key 의 대상(1:1) relation table raw 삭제 */
      if (selectTargetProductRawResult.onsale_product) {
        const target = await this.onSaleProductRepository.findOne({
          onsale_product_id:
            selectTargetProductRawResult.onsale_product.onsale_product_id,
        });
        await this.onSaleProductRepository.remove(target);
      }
      if (selectTargetProductRawResult.processed_product) {
        const target = await this.processedProductRepository.findOne({
          processed_product_id:
            selectTargetProductRawResult.processed_product.processed_product_id,
        });
        await this.processedProductRepository.remove(target);
      }
      if (selectTargetProductRawResult.weighted_product) {
        const target = await this.weightedProductRepository.findOne({
          weighted_product_id:
            selectTargetProductRawResult.weighted_product.weighted_product_id,
        });
        await this.weightedProductRepository.remove(target);
      }
    } catch {
      throw new Error('deleteProductInfo [Delete] Error');
    }
  }

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
