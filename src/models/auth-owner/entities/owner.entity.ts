import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OwnerBase } from '../interfaces/owner.interface';

/**
 * Entity Schema for Owner
 * @class Owner
 */
@Entity({
  name: 'owner',
})
export class Owner implements OwnerBase {
  @PrimaryGeneratedColumn({ type: 'int' })
  owner_id: number;

  @Column({ type: 'char', length: 30 })
  owner_pwd: string;

  @Column({ type: 'char', length: 15 })
  owner_name: string;

  @Column({ type: 'char', length: 10 })
  owner_gender: string;

  @Column({ type: 'date' })
  owner_birthday: Date;

  @Column({ type: 'char', length: 30 })
  owner_email: string;

  @Column({ type: 'char', length: 15 })
  owner_phone: string;

  @Column({ type: 'char', length: 255 })
  owner_address: string;

  @Column({ type: 'char', length: 255 })
  owner_identification_image: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  owner_created_at: Date;
}
