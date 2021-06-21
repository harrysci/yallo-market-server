import { Store } from '../entities/store.entity';

/**
 * @interface StoreBankBase
 * Store_Bank entity base interface
 */
export interface StoreBankBase {
  store_bank_id: number;
  store: Store;
  store_bank_name: string;
  store_account_number: string;
}
