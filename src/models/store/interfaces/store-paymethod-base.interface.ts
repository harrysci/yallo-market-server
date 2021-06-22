import { Store } from '../entities/store.entity';

/**
 * @interface StorePaymethodBase
 * Store_Paymethod entity base interface
 */
export interface StorePaymethodBase {
  store_paymethod_id: number;
  store: Store;
  store_pay_method: string;
}
