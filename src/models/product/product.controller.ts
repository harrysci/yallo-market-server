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

  @Get('/:id')
  async getProductInfo(@Param('id') id:number): Promise<Product>{
    console.log(id);
    return await this.productService.getProductInfo(id);
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
