import { Owner } from 'src/models/auth-owner/entities/owner.entity';
import { StoreBank } from '../entities/store-bank.entity';
import { StorePaymethod } from '../entities/store-paymethod.entity';

/**
 * @interface StoreBase
 * store entity base interface
 */
export interface StoreBase {
  store_id: number;
  owner: Owner;
  store_name: string;
  store_address: string;
  store_phone: string;
  store_image: string;
  store_star_point: number;
  store_open_time: string;
  store_close_time: string;
  store_is_open: boolean;
  store_is_delivery: boolean;
  store_business_number: string;
  store_business_store_name: string;
  store_business_store_address: string;
  store_business_date: Date;
  store_business_owner_birthday: Date;
  store_business_owner_name: string;
  store_business_image: string;
  store_bank: StoreBank[];
  store_paymethod: StorePaymethod[];
}
