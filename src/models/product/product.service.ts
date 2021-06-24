import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductListRes } from './dto/getProductListRes.dto';
import { UpdateProductInfoReq } from './dto/updateProductInfoReq.dto';
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
  ) {}

  /**********************************************************************************
   * @점주WebApp
   **********************************************************************************/
  async getProductList(storeId: number) {
    /* Database 조회 결과 */
    const selectProductListRawResult = await this.productRepository
      .createQueryBuilder('product')
      .where('product.store_id = :store_id', { store_id: storeId })
      .innerJoinAndSelect('product.onsale_product', 'onsale_product')
      .innerJoinAndSelect('product.weighted_product', 'weighted_product')
      .innerJoinAndSelect('product.processed_product', 'processed_product')
      .getMany();

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

  async updateProductInfo(updateProductInfo: UpdateProductInfoReq) {
    const selectProductRawResult = await this.productRepository
      .createQueryBuilder('product')
      .where('product.product_id = :product_id', {
        product_id: updateProductInfo.productId,
      })
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .getOne();

    selectProductRawResult.onsale_product = {
      ...selectProductRawResult.onsale_product,
      product_onsale_price: updateProductInfo.productOnSalePrice
        ? updateProductInfo.productOnSalePrice
        : updateProductInfo.productCurrentPrice,
    };

    if (selectProductRawResult.product_is_processed) {
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
    await this.productRepository.save(selectProductRawResult);

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

    const selectUpdatedProductRawResult = await this.productRepository
      .createQueryBuilder('product')
      .where('product.product_id = :product_id', {
        product_id: updateProductInfo.productId,
      })
      .innerJoinAndSelect('product.onsale_product', 'onsale_product')
      .innerJoinAndSelect('product.weighted_product', 'weighted_product')
      .innerJoinAndSelect('product.processed_product', 'processed_product')
      .getOne();

    const updatedProductInfo = {
      productId: selectUpdatedProductRawResult.product_id,
      productBarcode: selectUpdatedProductRawResult.product_barcode,
      productName: selectUpdatedProductRawResult.product_name,
      productOriginPrice: selectUpdatedProductRawResult.product_original_price,
      productCurrentPrice: selectUpdatedProductRawResult.product_current_price,
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
  }

  async deleteProductInfo(productId: number): Promise<void> {
    const selectTargetProductRawResult = await this.productRepository
      .createQueryBuilder('product')
      .where('product.product_id = :product_id', { product_id: productId })
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .getOne();

    await this.productRepository.remove(selectTargetProductRawResult);

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

    return;
  }
}
