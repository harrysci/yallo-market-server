/**
 * @interface OwnerBase
 * owner entity base interface
 */
export interface OwnerBase {
  owner_id: number;
  owner_pwd: string;
  owner_name: string;
  owner_gender: string;
  owner_birthday: Date;
  owner_email: string;
  owner_phone: string;
  owner_address: string;
  owner_identification_image: string;
  owner_created_at: Date;
}
