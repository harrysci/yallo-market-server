import { User } from '../entities/user.entity';

/**
 * @interface UserOrderBase
 * user_order entity base interface
 */
export interface UserOrderBase {
  user_order_id: number;
  user: User;
  order_number: string;
}
