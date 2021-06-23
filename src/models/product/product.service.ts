import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindStoreProductDto } from './dto/FindStoreProduct.dto';
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
  
  async getAllProductInfo(): Promise<Product[]>{
    return await this.productRepository.find();
  }
  // async getProductInfo(id: number): Promise<Product>{
  //   return await this.productRepository.createQueryBuilder('product')
  //           .where('product.product_id=:id',{id})
  //           // .andWhere('product.store_id=:store_id', {store_id})
  //           .leftJoinAndSelect('product.product_image','product_image')
  //           .leftJoinAndSelect('product.processed_product', 'processed_product')
  //           .leftJoinAndSelect('product.weighted_product', 'weighted_product')
  //           .getOne();
  // }
  async getStoreProduct(req: FindStoreProductDto): Promise<Product>{
    return await this.productRepository.createQueryBuilder('product')
            .where('product.product_id=:id',{id:req.product_id})
            .andWhere('product.store_id=:store_id', {store_id:req.store_id})
            .leftJoinAndSelect('product.product_image','product_image')
            .leftJoinAndSelect('product.processed_product', 'processed_product')
            .leftJoinAndSelect('product.weighted_product', 'weighted_product')
            .getOne();
  }
}
