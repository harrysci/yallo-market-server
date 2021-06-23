import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UpdateDateColumn } from 'typeorm';
import { GetProductListRes } from './dto/getProductListRes.dto';
import { UpdateProductInfoReq } from './dto/updateProductInfoReq.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**********************************************************************************
   * @점주WebApp
   **********************************************************************************/
  @Get('info-list-admin')
  async getProductListForOwnerWeb(
    @Query('storeId') storeId: number,
  ): Promise<GetProductListRes[]> {
    return await this.productService.getProductList(storeId);
  }

  @Put('info-update')
  async updateProductInfoForOwnerWeb(
    @Query('id') productId: number,
    @Body() updateProductInfo: UpdateProductInfoReq,
  ) {
    return await this.productService.updateProductInfo(
      productId,
      updateProductInfo,
    );
  }
}
