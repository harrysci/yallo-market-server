export class StorePaymethod {
  store_paymethod_id: number;
  store_pay_method: string;
}

export class StoreBank {
  store_bank_id: number;
  store_bank_name: string;
  store_account_number: string;
}

export class GetStoreListRes {
  store_id: number;
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

  store_paymethod: StorePaymethod[];
  store_bank: StoreBank[];
}
