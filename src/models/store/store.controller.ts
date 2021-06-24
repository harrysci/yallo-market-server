import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/getStoreName/:ownerId')
  async getStoreNameByOwnerId(
    @Param('ownerId') ownerId: number,
  ): Promise<string | null> {
    return await this.storeService.getStoreNameByOwnerId(ownerId);
  }
}
