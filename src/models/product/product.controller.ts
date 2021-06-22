import { Controller, Get, Query, Post, Body, Put, Param } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Get('/test')
  // testProductApi(){
  //   return this.productService.testApi();
  // }
  @Get('/list')
  async getAllProductInfo(): Promise<Product[]> {
    console.log();
    return await this.productService.getAllProductInfo();
  }

  @Put('/:id')
  async putProductInfo(@Param('id') @Body() product:Product): Promise<Product>{
    return this.productService.saveProduct(product);
  }

  @Post()
  async create(@Body() product:Product): Promise<Product> {
    return this.productService.saveProduct(product);
  }
}
