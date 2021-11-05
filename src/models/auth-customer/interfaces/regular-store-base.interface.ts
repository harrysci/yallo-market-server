import { User } from '../entities/user.entity';

/**
 * @interface RegularStoreBase
 * regular_store entity base interface
 */
export interface RegularStoreBase {
  regular_store_id: number;
  user: User;
  store_id: number;
}
