import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* User 프로필 Entity */
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  /**
   * Create an instance of class.
   * @constructs
   * @param {Repository<User>}
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * User Table test function
   * @returns user 테이블 find result
   */
  async testFunc() {
    return this.userRepository.find();
  }
}
