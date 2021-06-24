import { Controller, Get, Param } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('/getStoreId/:ownerId')
  async getStoreIdByOwnerId(
    @Param('ownerId') ownerId: number,
  ): Promise<number> {
    return await this.storeService.getStoreIdByOwnerId(ownerId);
  }
}
