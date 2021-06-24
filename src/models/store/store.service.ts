import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreIdNameRes } from './dto/StoreIdNameRes.dto';
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
   *  ownerId 에 해당하는 store 가 존재하는 경우 -> @return storeIdName
   *  ownerId 에 해당하는 store 가 존재하지 않는 경우 -> @return null
   */
  async getStoreIdNameByOwnerId(ownerId: number): Promise<StoreIdNameRes> {
    const rawStore = await this.storeRepository
      .createQueryBuilder('store')
      .where('store.owner=:ownerId', { ownerId: ownerId })
      .getOne();

    const storeIdName: StoreIdNameRes = !rawStore
      ? null
      : {
          storeId: rawStore.store_id,
          storeName: rawStore.store_name,
        };

    return storeIdName;
  }

  /**
   *
   * @param storeId
   *  ownerId 에 해당하는 store 가 존재하는 경우 -> @return store
   *  ownerId 에 해당하는 store 가 존재하지 않는 경우 -> @return null
   */
  async getStore(storeId: number): Promise<Store> {
    const store = await this.storeRepository
      .createQueryBuilder('store')
      .where('store.store_id=:storeId', { storeId: storeId })
      .getOne();
      
    return store;
  }
}
