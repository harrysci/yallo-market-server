import { Store } from 'src/models/store/store-entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Entity Schema for Owner
 * @class Owner
 */
@Entity({
  name: 'owner',
})
export class Owner {
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

  // Store(1) <-> Owner(1)
  @OneToOne((type) => Store, (store) => store.owner, {
    eager: true,
    // onDelete: 'CASCADE',
  })
  @JoinColumn()
  store: Store;
}
