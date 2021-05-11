import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccountType } from '../constants/accountType.type';

/**
 * Entity Schema for Users
 * @class User
 */
@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  _id?: number;

  @Column()
  userId: string;

  @Column({
    nullable: true,
  })
  name!: string;

  @Column({
    nullable: true,
  })
  nickName: string;

  @Column({
    nullable: true,
  })
  gender: string;

  @Column({
    nullable: true,
  })
  birthday!: string;

  @Column({
    nullable: true,
  })
  age!: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  address!: string;

  @Column({
    nullable: true,
  })
  thumbnail!: string;

  @Column()
  accountType: AccountType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: string;
}
