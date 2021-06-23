import { Controller, Get, Query, Post, Body, Put, Param } from '@nestjs/common';
import { FindStoreProductDto } from './dto/FindStoreProduct.dto';
import { ProductListDto } from './dto/ProductListDto.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/detail-info')
  async getProductDetailInfo(@Query() req:FindStoreProductDto): Promise<ProductListDto>{
    console.log(req);
    return await this.productService.getProductDetailInfo(req);
  }
}
