import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtUserAuthGuard } from '../auth-customer/guards/jwt-auth-customer.guard';
import { GetStoreListRes } from './dto/GetStoreListRes.dto';
import { StoreIdNameRes } from './dto/StoreIdNameRes.dto';
import { Store } from './entities/store.entity';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  /**
   ************************************************************************************************************************
   * Get Router
   *
   * @name getStoreList
   * @description [소비자 모바일 애플리케이션] 점포정보목록조회
   *
   * @name getStoreNameByOwnerId
   * @description owner_id 를 통한 store_id, store_name 조회
   *
   * @name getStore
   * @description 점포정보단건조회
   *
   ************************************************************************************************************************
   */

  /**
   * [소비자 모바일 애플리케이션] 점포 정보 목록 조회
   * @name 점포정보목록조회
   * @link https://www.notion.so/R-0b3abc27c6b942a5973595a278173919
   * @returns GetStoreListRes[];
   */
  @Get('/getStoreList')
  async getStoreList(): Promise<GetStoreListRes[]> {
    return await this.storeService.getStoreList();
  }

  /**
   * owner_id 를 통한 store_id, store_name 조회
   * @name 점포아이디점포명조회_ownerId
   * @link
   * @param ownerId owner_id
   * @returns StoreIdNameRes; store_id 와 store_name 을 반환
   */
  @Get('/getStoreIdName/:ownerId')
  async getStoreNameByOwnerId(
    @Param('ownerId') ownerId: number,
  ): Promise<StoreIdNameRes> {
    return await this.storeService.getStoreIdNameByOwnerId(ownerId);
  }

  /**
   * 점포 정보 단건 조회
   * @name 점포정보단건조회_storeId
   * @link
   * @param storeId store_id
   * @returns Store;
   */
  @Get('/getStore/:storeId')
  async getStore(@Param('storeId') storeId: number): Promise<Store> {
    return await this.storeService.getStore(storeId);
  }

  /**
   * 점포 계좌정보 단건 조회
   * @name 계좌정보단건조회_storeId
   * @link
   * @param storeId store_id
   * @returns Store;
   */
  @Get('/getStoreBank/:storeId')
  // async getStoreBank(@Param('storeId') storeId: number): Promise<StoreBank> {
  async getStoreBank(@Param('storeId') storeId: number): Promise<any> {
    return await this.storeService.getStoreBank(storeId);
  }
  /**
   * @name 가게명_포함_가게리스트조회
   * @param storeName 가게 이름
   * @returns Store[]
   */
  @UseGuards(JwtUserAuthGuard)
  @Get('/get-store-list')
  async getStoreListByStoreName(
    @Query('storeName') storeName: string,
  ): Promise<Store[]> {
    return await this.storeService.getStoreListByStoreName(storeName);
  }
}
