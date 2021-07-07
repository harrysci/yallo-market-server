import { Controller, Get, Param } from '@nestjs/common';
import { StoreIdNameRes } from './dto/StoreIdNameRes.dto';
import { Store } from './entities/store.entity';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

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
