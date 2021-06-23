import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindStoreProductDto } from './dto/FindStoreProduct.dto';
import { ProductDetailDto } from './dto/ProductDetailDto.dto';
import { OnsaleProduct } from './entities/onsale-product.entity';
import { ProcessedProduct } from './entities/processed-product.entity';
import { Product } from './entities/product.entity';
import { WeightedProduct } from './entities/weighted-product.entity';
import { ProductBase } from './interfaces/product-base.interface';

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
  
  async getProductDetailInfo(req: FindStoreProductDto): Promise<ProductDetailDto>{
    /*조회 결과*/ 
    const productRawInfo=await this.productRepository.createQueryBuilder('product')
            .where('product.product_id=:id',{id:req.product_id})
            .andWhere('product.store.store_id=:store_id', {store_id:req.store_id})
            .leftJoinAndSelect('product.product_image','product_image')
            .leftJoinAndSelect('product.onsale_product','onsale_product')
            .leftJoinAndSelect('product.processed_product', 'processed_product')
            .leftJoinAndSelect('product.weighted_product', 'weighted_product')
            .getOne();
    /*정보 리스트 정제*/
    const productDetailInfo: ProductDetailDto={
      product_id:productRawInfo.product_id, 
      product_barcode: productRawInfo.product_barcode,
      product_name: productRawInfo.product_name,
      product_original_price: productRawInfo.product_original_price,
      product_current_price: productRawInfo.product_current_price,
      product_profit: productRawInfo.product_profit,
      product_description: productRawInfo.product_description,
      product_is_processed: productRawInfo.product_is_processed,
      product_is_soldout: productRawInfo.product_is_soldout,
      product_onsale: productRawInfo.product_onsale,
      product_category: productRawInfo.product_category,
      product_created_at: productRawInfo.product_created_at,
      
      representative_image: productRawInfo.product_image[0].product_image,
      detail_image:productRawInfo.product_image[1].product_image,
      additional_image:productRawInfo.product_image[2].product_image,
      // processed_product attributes
      onsale_product_id:
        productRawInfo.onsale_product != null
        ?productRawInfo.onsale_product.onsale_product_id
        :null,
      product_onsale_price:
        productRawInfo.onsale_product != null
        ?productRawInfo.onsale_product.product_onsale_price
        :null,
      processed_product_id:
        productRawInfo.processed_product != null
        ?productRawInfo.processed_product.processed_product_id
        :null,
      processed_product_name: productRawInfo.processed_product != null
      ?productRawInfo.processed_product.processed_product_name
      :null,
      processed_product_company:productRawInfo.processed_product !=null
      ? productRawInfo.processed_product.processed_product_company
      :null,
      processed_product_standard_type: productRawInfo.processed_product!= null
      ?productRawInfo.processed_product.processed_product_standard_type
      :null,
      processed_product_standard_values: productRawInfo.processed_product != null
      ?productRawInfo.processed_product.processed_product_standard_values
      :null,
      processed_product_composition: productRawInfo.processed_product != null
      ?productRawInfo.processed_product.processed_product_composition
      :null,
      processed_product_volume:productRawInfo.processed_product != null
      ? productRawInfo.processed_product.processed_product_volume
      :null,
      processed_product_adult:productRawInfo.processed_product!= null
      ? productRawInfo.processed_product.processed_product_adult
      :null,
      processed_product_caution:productRawInfo.processed_product!= null
      ? productRawInfo.processed_product.processed_product_caution
      :null,
      processed_product_information:productRawInfo.processed_product!= null
      ? productRawInfo.processed_product.processed_product_information
      :null,
      // weighted_product attributes
      weighted_product_id:productRawInfo.weighted_product!= null
      ? productRawInfo.weighted_product.weighted_product_id
      :null,
      weighted_product_volume:productRawInfo.weighted_product!= null
      ? productRawInfo.weighted_product.weighted_product_volume
      :null,
    }
    return productDetailInfo;
  }
}
