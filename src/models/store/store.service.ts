import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetStoreListRes } from './dto/GetStoreListRes.dto';
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
   ************************************************************************************************************************
   * Get Method
   *
   * @name getStoreList
   * @description 점포정보목록조회
   *
   * @name getStoreNameByOwnerId
   * @description owner_id 를 통한 store_id, store_name 조회
   *
   * @name getStore
   * @description 점포단건조회
   *
   ************************************************************************************************************************
   */

  /**
   * 점포정보목록조회
   * @return GetStoreListRes[];
   */
  async getStoreList(): Promise<GetStoreListRes[]> {
    try {
      const rawStoreList = await this.storeRepository
        .createQueryBuilder('store')
        .leftJoinAndSelect('store.store_paymethod', 'store_paymethod')
        .leftJoinAndSelect('store.store_bank', 'store_bank')
        .getMany();

      if (rawStoreList) {
        const storeList: GetStoreListRes[] = rawStoreList.map<GetStoreListRes>(
          (each) => ({
            store_id: each.store_id,
            store_name: each.store_name,
            store_image: each.store_image,

            store_phone: each.store_phone,
            store_address: each.store_address,
            store_star_point: each.store_star_point,

            store_is_delivery: each.store_is_delivery,
            store_is_open: each.store_is_open,
            store_open_time: each.store_open_time,
            store_close_time: each.store_close_time,

            store_business_date: each.store_business_date,
            store_business_image: each.store_business_image,
            store_business_number: each.store_business_number,
            store_business_owner_birthday: each.store_business_owner_birthday,
            store_business_owner_name: each.store_business_owner_name,
            store_business_store_address: each.store_business_store_address,
            store_business_store_name: each.store_business_store_name,

            store_paymethod: each.store_paymethod,
            store_bank: each.store_bank,
          }),
        );

        return storeList;
      }
    } catch {
      throw new Error(`[getStoreList error] no store was found`);
    }
  }

  /**
   * owner_id 를 통한 store_id, store_name 조회
   * @param ownerId owner_id
   * @returns StoreIdNameRes;
   *   1. ownerId 에 해당하는 store 가 존재하는 경우 -> storeIdName 반환
   * @returns null;
   *   2. ownerId 에 해당하는 store 가 존재하지 않는 경우 -> null 반환
   */
  async getStoreIdNameByOwnerId(ownerId: number): Promise<StoreIdNameRes> {
    try {
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
    } catch {
      throw new Error(
        `[getStoreIdNameByOwnerId Error] no store was found by owner_id: ${ownerId}`,
      );
    }
  }

  /**
   * 점포단건조회
   * @param storeId store_id
   * @return Store;
   *   1. ownerId 에 해당하는 store 가 존재하는 경우 -> Store 반환
   * @return null;
   *   2. ownerId 에 해당하는 store 가 존재하지 않는 경우 -> @return null
   */
  async getStore(storeId: number): Promise<Store> {
    const store = await this.storeRepository
      .createQueryBuilder('store')
      .where('store.store_id=:storeId', { storeId: storeId })
      .getOne();

    return store;
  }
}
