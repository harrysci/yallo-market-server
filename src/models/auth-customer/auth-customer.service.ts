import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocalUserReq } from './dto/CreateLocalUserReq.dto';
import { CreateLocalUserRes } from './dto/CreateLocalUserRes.dto';
import { RegularStore } from './entities/regular-store.entity';
import { UserOrder } from './entities/user-order.entity';
import { User } from './entities/user.entity';

@Injectable()
export class AuthCustomerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(UserOrder)
    private readonly userOrderRepository: Repository<UserOrder>,

    @InjectRepository(RegularStore)
    private readonly regularStoreRepository: Repository<RegularStore>,

    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    console.log('유저 전체 불러오기');
    return this.userRepository.find();
  }

  async findOne(user_email: string): Promise<User> {
    console.log('유저 이메일로 불러오기');
    return this.userRepository.findOne(user_email);
  }

  async login(user: any) {
    console.log('login 진입');

    const payload = {
      username: user.user_email,
      sub: user.user_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(user_email: string, user_password: string): Promise<any> {
    const user = await this.userRepository.findOne({ user_email: user_email });

    if (user && user.user_password === user_password) {
      const { user_password, ...res } = user;
      return res;
    }

    return null;
  }

  /**
   * 회원 정보 생성
   * @param userData CreateLocalUserReq
   * @returns CreateLocalUserRes;
   */
  async createLocalUser(
    userData: CreateLocalUserReq,
  ): Promise<CreateLocalUserRes> {
    const user = await this.userRepository.create({
      user_email: userData.user_email,
      user_password: userData.user_password,
      user_account_type: userData.user_account_type,
      user_nickname: userData.user_nickname,
      user_birthday: userData.user_birthday,
      user_phone: userData.user_phone,
      user_address: userData.user_address,
      user_marketing_agree: userData.user_marketing_agree,
    });
    await this.userRepository.save(user);

    const res: CreateLocalUserRes = await this.getUserByUserId(user.user_id);

    return res;
  }

  /**
   ************************************************************************************************************************
   * Private Method
   *
   * @name getUserByUserId
   * @description user_id 를 통한 user 단건 조회
   *
   * @name getUserByUserEmail
   * @description user_email 를 통한 user 단건 조회
   *
   ************************************************************************************************************************
   */

  /**
   * user_id 를 통한 user 단건 조회
   * @param userId user_id
   * @returns CreateLocalUserRes;
   */
  private async getUserByUserId(userId: number): Promise<CreateLocalUserRes> {
    const user = await this.userRepository.findOne(userId);
    const { user_password, ...res } = user;

    return res;
  }

  /**
   * user_email 를 통한 user 단건 조회
   * @param userEmail user_email
   * @returns CreateLocalUserRes;
   */
  private async getUserByUserEmail(
    userEmail: string,
  ): Promise<CreateLocalUserRes> {
    const user = await this.userRepository.findOne({ user_email: userEmail });
    const { user_password, ...res } = user;

    return res;
  }
}
