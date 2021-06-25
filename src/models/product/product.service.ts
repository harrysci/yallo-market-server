import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindStoreProductDto } from './dto/FindStoreProduct.dto';
import { ProductDetailDto } from './dto/ProductDetailDto.dto';
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
      productId:productRawInfo.product_id, 
      productBarcode: productRawInfo.product_barcode,
      productName: productRawInfo.product_name,
      productOriginalPrice: productRawInfo.product_original_price,
      productCurrentPrice: productRawInfo.product_current_price,
      productProfit: productRawInfo.product_profit,
      productDescription: productRawInfo.product_description,
      productIsProcessed: productRawInfo.product_is_processed,
      productIsSoldout: productRawInfo.product_is_soldout,
      productOnsale: productRawInfo.product_onsale,
      productCategory: productRawInfo.product_category,
      productCreatedAt: productRawInfo.product_created_at,
      
      representativeProductImageId: productRawInfo.product_image[0].product_image_id,
      representativeProductImage: productRawInfo.product_image[0].product_image,
      detailProductImageId: productRawInfo.product_image[1].product_image_id,
      detailProductImage:productRawInfo.product_image[1].product_image,
      additionalProductImageId: productRawInfo.product_image[2].product_image_id,
      additionalProductImage:productRawInfo.product_image[2].product_image,
      // processed_product attributes
      onsaleProductId:
        productRawInfo.onsale_product != null
        ?productRawInfo.onsale_product.onsale_product_id
        :null,
      productOnsalePrice:
        productRawInfo.onsale_product != null
        ?productRawInfo.onsale_product.product_onsale_price
        :null,
      processedProductId:
        productRawInfo.processed_product != null
        ?productRawInfo.processed_product.processed_product_id
        :null,
      processedProductName: productRawInfo.processed_product != null
      ?productRawInfo.processed_product.processed_product_name
      :null,
      processedProductCompany:productRawInfo.processed_product !=null
      ? productRawInfo.processed_product.processed_product_company
      :null,
      processedProductStandardType: productRawInfo.processed_product!= null
      ?productRawInfo.processed_product.processed_product_standard_type
      :null,
      processedProductStandardValues: productRawInfo.processed_product != null
      ?productRawInfo.processed_product.processed_product_standard_values
      :null,
      processedProductComposition: productRawInfo.processed_product != null
      ?productRawInfo.processed_product.processed_product_composition
      :null,
      processedProductVolume:productRawInfo.processed_product != null
      ? productRawInfo.processed_product.processed_product_volume
      :null,
      processedProductAdult:productRawInfo.processed_product!= null
      ? productRawInfo.processed_product.processed_product_adult
      :null,
      processedProductCaution:productRawInfo.processed_product!= null
      ? productRawInfo.processed_product.processed_product_caution
      :null,
      processedProductInformation:productRawInfo.processed_product!= null
      ? productRawInfo.processed_product.processed_product_information
      :null,
      // weighted_product attributes
      weightedProductId:productRawInfo.weighted_product!= null
      ? productRawInfo.weighted_product.weighted_product_id
      :null,
      weightedProductVolume:productRawInfo.weighted_product!= null
      ? productRawInfo.weighted_product.weighted_product_volume
      :null,
    }
    return productDetailInfo;
  }
}
