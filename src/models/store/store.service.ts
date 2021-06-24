import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreBank } from './entities/store-bank.entity';
import { StorePaymethod } from './entities/store-paymethod.entity';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,

    @InjectRepository(StoreBank)
    private readonly storeBankRepository: Repository<StoreBank>,

    @InjectRepository(StorePaymethod)
    private readonly storePaymethodRepository: Repository<StorePaymethod>,
  ) {}

  /**
   *
   * @param ownerId
   *  ownerId 에 해당하는 store 가 존재하는 경우 -> @return storeId
   *  ownerId 에 해당하는 store 가 존재하지 않는 경우 -> @return -1
   */
  async getStoreIdByOwnerId(ownerId: number): Promise<number> {
    const rawStore = await this.storeRepository
      .createQueryBuilder('store')
      .where('store.owner=:ownerId', { ownerId: ownerId })
      .getOne();

    const storeId: number = rawStore ? rawStore.store_id : -1;

    return storeId;
  }
}
