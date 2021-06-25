import { Controller, Get, Query } from '@nestjs/common';
import { FindStoreProductDto } from './dto/FindStoreProduct.dto';
import { ProductDetailDto } from './dto/ProductDetailDto.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/detail-info')
  async getProductDetailInfo(@Query() req:FindStoreProductDto): Promise<ProductDetailDto>{
    console.log(req);
    return await this.productService.getProductDetailInfo(req);
  }
}
