import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity Schema for Users
 * @class User
 */
@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  nickName: string;

  @Column()
  gender: string;

  @Column()
  birthday: string;

  @Column()
  age: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  thumbnail: string;

  @Column()
  accountType: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
}
