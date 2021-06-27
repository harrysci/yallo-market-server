import { HttpService, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductListRes } from './dto/getProductListRes.dto';
import { UpdateProductInfoReq } from './dto/updateProductInfoReq.dto';
import { UpdateProductInfoRes } from './dto/updateProductInfoRes.dto';
import { OnsaleProduct } from './entities/onsale-product.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { Product } from './entities/product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';
import { KorchamConfigService } from '../../config/korcham/configuration.service';
import { ProductImage } from './entities/product-image.entity';

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

    private readonly httpService: HttpService,
    private readonly korchamConfig: KorchamConfigService,
  ) {}

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
          : null,
        productProfit: eachProduct.product_profit,
        productIsProcessed: eachProduct.product_is_processed,
        productOnSale: eachProduct.product_onsale,
        productVolume: eachProduct.processed_product
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
     * 1. processed product 정보 수정
     * 2. weighted product 정보 수정
     * 3. on sale product 정보 수정
     */
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

    if (
      selectProductRawResult.onsale_product &&
      updateProductInfo.productOnSale
    ) {
      /* 기존 OnSale 이면서 수정 정보가 OnSale 인 경우 */
      selectProductRawResult.onsale_product = {
        ...selectProductRawResult.onsale_product,
        product_onsale_price: updateProductInfo.productOnSalePrice,
      };
    } else if (
      /* 기존 OnSale 이면서 수정 정보가 OnSale 인 경우 */
      selectProductRawResult.onsale_product &&
      !updateProductInfo.productOnSale
    ) {
      const deleteTarget = selectProductRawResult.onsale_product;
      selectProductRawResult.onsale_product = null;
      await this.productRepository.save(selectProductRawResult);
      await this.onSaleProductRepository.remove(deleteTarget);
    } else if (
      !selectProductRawResult.onsale_product &&
      updateProductInfo.productOnSale
    ) {
      /* 기존 OnSale 이 아니면서 수정 정보가 OnSale 인 경우 */
      const newOnsaleProduct = new OnsaleProduct();
      newOnsaleProduct.product_onsale_price =
        updateProductInfo.productOnSalePrice;

      selectProductRawResult.onsale_product = newOnsaleProduct;
    }

    try {
      /* 수정한 정보 적용 */
      await this.productRepository.save(selectProductRawResult);

      /* product 정보 수정 */
      await this.productRepository
        .createQueryBuilder('prdouct')
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
          : null,
        productProfit: selectUpdatedProductRawResult.product_profit,
        productIsProcessed: selectUpdatedProductRawResult.product_is_processed,
        productOnSale: selectUpdatedProductRawResult.product_onsale,
        productVolume: selectUpdatedProductRawResult.processed_product
          ? selectUpdatedProductRawResult.processed_product
              .processed_product_volume
          : selectUpdatedProductRawResult.weighted_product
              .weighted_product_volume,
      };
      return updatedProductInfo;
    } catch (e) {
      throw new Error('updateProductInfo [Update] Error :' + e.message);
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
        /* 3-1. onSaleProduct 가 존재하는 경우 삭제 */
        const target = await this.onSaleProductRepository.findOne({
          onsale_product_id:
            selectTargetProductRawResult.onsale_product.onsale_product_id,
        });
        await this.onSaleProductRepository.remove(target);
      }
      if (selectTargetProductRawResult.processed_product) {
        /* 3-2. processedProduct 가 존재하는 경우 삭제 */
        const target = await this.processedProductRepository.findOne({
          processed_product_id:
            selectTargetProductRawResult.processed_product.processed_product_id,
        });
        await this.processedProductRepository.remove(target);
      }
      if (selectTargetProductRawResult.weighted_product) {
        /* 3-2. weightedProduct 가 존재하는 경우 삭제 */
        const target = await this.weightedProductRepository.findOne({
          weighted_product_id:
            selectTargetProductRawResult.weighted_product.weighted_product_id,
        });
        await this.weightedProductRepository.remove(target);
      }
    } catch (e) {
      throw new Error('deleteProductInfo [Delete] Error : ' + e.message);
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
