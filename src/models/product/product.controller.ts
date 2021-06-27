import { Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Delete,
  Get,
  ParseIntPipe,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GetProductListRes } from './dto/getProductListRes.dto';
import { UpdateProductInfoReq } from './dto/updateProductInfoReq.dto';
import { UpdateProductInfoRes } from './dto/updateProductInfoRes.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload/:store_id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile(
    @UploadedFile() file:Express.Multer.File,
    @Param('store_id') store_id:number ){
    //this.logger.debug(rows);
    
    console.log(store_id);
    return await this.productService.uploadExcelFile(file,store_id);
  /**********************************************************************************
   * @점주WebApp
   **********************************************************************************/

  /**
   * 점주 및 점포 관리인 웹 대시보드 상품 목록 조회
   * @param storeId 가게 id
   * @returns GetProductListRes[], 웹 요청 상품 정보 리스트 반환
   */
    }
  @Get('info-list-admin')
  async getProductListForOwnerWeb(
    @Query('storeId', ParseIntPipe) storeId: number,
  ): Promise<GetProductListRes[]> {
    return await this.productService.getProductList(storeId);
  }

  /**
   * 점주 및 점포 관리인 웹 대시보드 개별 상품 정보 수정
   * @param updateProductInfo 수정할 상품의 id 및 수정할 상품 정보
   * @returns UpdateProductInfoRes , 수정된 웹 요청 상품 정보 반환
   */
  @Put('info-update')
  async updateProductInfoForOwnerWeb(
    @Body(new ValidationPipe())
    updateProductInfo: UpdateProductInfoReq,
  ): Promise<UpdateProductInfoRes> {
    return await this.productService.updateProductInfo(updateProductInfo);
  }

  /**
   * 점주 및 점포 관리인 웹 대시보드 개별 상품 삭제 (on sale, processed, weighted 동시 삭제)
   * @param productId 삭제할 상품의 id
   * @returns void
   */
  @Delete('info-delete')
  async deleteProductInfoForOwnerWeb(
    @Query('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    return await this.productService.deleteProductInfo(productId);
  }

}
