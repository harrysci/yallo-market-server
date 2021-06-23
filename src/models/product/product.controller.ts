import { Controller, Get, Query, Post, Body, Put, Param } from '@nestjs/common';
import { FindStoreProductDto } from './dto/FindStoreProduct.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/list')
  async getAllProductInfo(): Promise<Product[]> {
    console.log();
    return await this.productService.getAllProductInfo();
  }

  // @Get('/:product_id')
  // async getProductInfo(@Param('product_id') id:number): Promise<Product>{
  //   console.log(id);
  //   return await this.productService.getProductInfo(id);
  // }
  @Get('/Info')
  async getStoreProduct(@Body() req:FindStoreProductDto): Promise<Product>{
    console.log(req);
    return await this.productService.getStoreProduct(req);
  }
}
