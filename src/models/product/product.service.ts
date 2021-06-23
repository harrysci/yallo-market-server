import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/ProductDto.dto';
import { ProductListDto } from './dto/ProductListDto.dto';
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
  // testApi() {
  //   const product:ProductDto ={
  //     product_id: 12,
  //     store_id: 22,
  //     product_barcode: "test1",
  //     product_name: "test1",
  //     product_original_price: 123,
  //     product_current_price: 100,
  //     product_profit: 11,
  //     product_description: "test1",
  //     product_is_processed: false,
  //     product_is_soldout: false,
  //     product_onsale: false,
  //     product_category: "test1",
  //     product_created_at: default,
  //     product_image: NULL,
  //     processed_product: NULL,
  //     weighted_product: NULL,
  //     onsale_product: NULL,
  //   }
  //   return this.productRepository.save(product);
  // }
  /*@param reqData*/
  async getAllProductInfo(): Promise<Product[]>{
    return await this.productRepository.find();
  }
  async getProductInfo(id: number): Promise<any>{
    
    const productData= await this.productRepository
        .createQueryBuilder('product')
        // .select(['product'])
        // .innerJoin('product.product_id=:processed_product.processed_product_id',
        // 'product')
        //.where('processed_product.processed_product_id=:id',{id})
        .innerJoinAndSelect('product.processed_product', 'processed_product')
        .innerJoinAndSelect('product.processed_product', 'weighted_product')
        // .andWhere('product.product_id = :id', { id})
        .getOne();
    // return await this.productRepository.findOne(productData);
    console.log(productData);

    // if(productData.product_is_processed==true){
    //   return await this.productRepository.findOne(productData.product_id);
    // } 
    // else{
    //   return await this.productRepository.findOne(productData.product_id);
    // }
    
  }

  async saveProduct(product: Product): Promise<Product>{
    return await this.productRepository.save(product);
  }
}
