import { Controller, Get, Query } from '@nestjs/common';
import { GetProductListRes } from './dto/getProductListRes.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**********************************************************************************
   * @점주WebApp
   **********************************************************************************/
  @Get('list-admin')
  async getProductListForOwnerWeb(
    @Query('storeId') storeId: number,
  ): Promise<GetProductListRes[]> {
    return await this.productService.getProductList(storeId);
  }
}
