import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductListRes } from './dto/getProductListRes.dto';
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
    const productRawList = await this.productRepository
      .createQueryBuilder('product')
      .where('product.store_id = :store_id', { store_id: storeId })
      .leftJoinAndSelect('product.onsale_product', 'onsale_product')
      .leftJoinAndSelect('product.weighted_product', 'weighted_product')
      .leftJoinAndSelect('product.processed_product', 'processed_product')
      .getMany();

    const productList: GetProductListRes[] =
      productRawList.map<GetProductListRes>((eachProduct) => ({
        productId: eachProduct.product_id,
        productBarcode: eachProduct.product_barcode,
        productName: eachProduct.product_name,
        productOriginPrice: eachProduct.product_original_price,
        productCurrentPrice: eachProduct.product_current_price,
        productOnSalePrice:
          eachProduct.onsale_product.length > 0
            ? eachProduct.onsale_product[0].product_onsale_price
            : eachProduct.product_current_price,
        productProfit: eachProduct.product_profit,
        productIsProcessed: eachProduct.product_is_processed,
        productOnSale: eachProduct.product_onsale,
        productVolume: eachProduct.product_is_processed
          ? eachProduct.processed_product[0].processed_product_volume
          : eachProduct.weighted_product[0].weighted_product_volume,
      }));

    return productList;
  }

  async updateProductInfo() {
    return;
  }

  async deleteProductInfo() {
    return;
  }
}
