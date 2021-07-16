import { Controller, Get, Param } from '@nestjs/common';
import { GetStoreListRes } from './dto/GetStoreListRes.dto';
import { StoreIdNameRes } from './dto/StoreIdNameRes.dto';
import { Store } from './entities/store.entity';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   * store list 조회
   * @returns GetStoreListRes[]
   */
  @Get('/getStoreList')
  async getStoreList(): Promise<GetStoreListRes[]> {
    return await this.storeService.getStoreList();
  }

  @Get('/getStoreIdName/:ownerId')
  async getStoreNameByOwnerId(
    @Param('ownerId') ownerId: number,
  ): Promise<StoreIdNameRes> {
    return await this.storeService.getStoreIdNameByOwnerId(ownerId);
  }

  @Get('/getStore/:storeId')
  async getStore(@Param('storeId') storeId: number): Promise<Store> {
    return await this.storeService.getStore(storeId);
  }
}
