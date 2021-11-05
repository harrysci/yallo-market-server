import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetStoreListRes } from '../store/dto/GetStoreListRes.dto';
import { Store } from '../store/entities/store.entity';
import { StoreService } from '../store/store.service';
import { ChangePasswordReq } from './dto/ChangePasswordReq.dto';
import { CreateLocalUserReq } from './dto/CreateLocalUserReq.dto';
import { CreateLocalUserRes } from './dto/CreateLocalUserRes.dto';
import { CreateSocialUserReq } from './dto/CreateSocialUserReq.dto';
import { CreateSocialUserRes } from './dto/CreateSocialUserRes.dto';
import { EmailDupleCheckRes } from './dto/EmailDupleCheckRes.dto';
import { LocalLoginRes } from './dto/LocalLoginRes.dto';
import { UserProfile } from './dto/UserProfile.dto';

import { RegularStore } from './entities/regular-store.entity';
import { UserOrder } from './entities/user-order.entity';
import { User } from './entities/user.entity';
import { JWTPayload } from './interfaces/user-token-payload.interface';

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

    private readonly storeService: StoreService,
  ) {}

  /**
   * 유저 목록 조회
   * @returns User[];
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getProfile(userId: number): Promise<UserProfile> {
    const result = await this.getUserByUserId(userId);
    return result;
  }

  /**
   * 이메일을 통한 유저 단건 조회
   * @param user_email
   * @returns User;
   */
  async findOne(user_email: string): Promise<CreateLocalUserRes> {
    const user = await this.userRepository.findOne({ user_email: user_email });
    if (!user) return null;
    else return user;
  }

  async login(payload: any): Promise<{ access_token: string }> {
    const newPayload = {
      username: payload.user_email,
      sub: payload.user_id,
    };

    return {
      access_token: this.jwtService.sign(newPayload),
    };
  }

  // async login(payload: LocalLoginRes): Promise<{ access_token: string }> {
  //   const newPayload = {
  //     username: payload.user_email,
  //     sub: payload.user_id,
  //   };
  //   return {
  //     access_token: this.jwtService.sign(newPayload),
  //   };
  // }

  async validateUser(
    user_email: string,
    user_password: string,
  ): Promise<LocalLoginRes> {
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
    try {
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
    } catch (e) {
      console.log(e);
    }
  }

  async getAuthNumber(): Promise<string> {
    let authNumber = '';

    for (let i = 0; i < 4; i += 1) {
      authNumber += Math.floor(Math.random() * 10);
    }

    return authNumber;
  }

  async getUserEmailByPhoneNumber(user_phone: string): Promise<any> {
    const users = await this.userRepository.find({ user_phone: user_phone });

    if (users.length === 0) {
      throw new Error(
        `[getUserEmailByPhoneNumber Error] no email was found by user_phone: ${user_phone}`,
      );
    } else {
      const userEmailList: string[] = [];

      for (let i = 0; i < users.length; i += 1) {
        // const position = users[i].user_email.indexOf('@');

        userEmailList.push(users[i].user_email);
      }

      return userEmailList;
    }
  }

  async updateUserPassword(userData: ChangePasswordReq): Promise<any> {
    const { user_email, user_password } = userData;

    const user = await this.getUserByUserEmail(user_email);

    if (user) {
      try {
        await this.userRepository
          .createQueryBuilder('user')
          .update(User)
          .where('user.user_id=:user_id', { user_id: user.user_id })
          .set({
            ...user,
            user_password: user_password,
          })
          .execute();
      } catch {
        throw new Error(
          `[updateUserPassword Error] update error by user_email: ${user_email}, user_id: ${user.user_id}`,
        );
      }
    }
  }

  async findUserByEmailAndPhone(
    user_email: string,
    user_phone: string,
  ): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_email=:user_email', { user_email: user_email })
      .andWhere('user.user_phone=:user_phone', { user_phone: user_phone })
      .getOne();

    if (user) return true;
    else return false;
  }

  /**
   * 소셜 계정회원 정보 생성
   * @param userData CreateSocialUserReq
   * @returns CreateSocialUserRes;
   */
  async createSocialUser(
    userData: CreateSocialUserReq,
  ): Promise<CreateSocialUserRes> {
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

    const tokenPayload: JWTPayload = {
      username: user.user_email,
      sub: user.user_id,
    };
    const accessToken = await this.jwtService.sign(tokenPayload);

    const resWithAccessToken: CreateSocialUserRes = {
      ...(await this.getUserByUserId(user.user_id)),
      access_token: accessToken,
    };

    return resWithAccessToken;
  }

  /**
   * @name 이메일중복검사_및_소셜로그인처리_메소드
   * @param email user_email
   * @param type kakao or apple or local
   * @returns EmailDupleCheckRes
   */
  async emailDupleCheck(
    email: string,
    type: 'kakao' | 'apple' | 'local',
  ): Promise<EmailDupleCheckRes> {
    try {
      const user = await this.getUserByUserEmail(email);

      if (
        (user.user_account_type === 'kakao' &&
          type === 'kakao' &&
          user.user_email === email) ||
        (user.user_account_type === 'apple' &&
          type === 'apple' &&
          user.user_email === email)
      ) {
        const tokenPayload: JWTPayload = {
          username: user.user_email,
          sub: user.user_id,
        };
        const socialLoginSuccessToken = this.jwtService.sign(tokenPayload);
        return {
          checkResult: 'SUCCESS',
          type: user.user_account_type,
          access_token: socialLoginSuccessToken,
        };
      } else
        (user.user_account_type === 'kakao' && type !== 'kakao') ||
          (user.user_account_type === 'apple' && type !== 'apple');
      return {
        checkResult: 'EXIST_OTHER_TYPE',
        existEmail: user.user_email,
        type: user.user_account_type,
      };
    } catch {
      console.log('err');
      return { checkResult: 'NOT_EXIST' };
    }
  }

  /**
   * @name RegularStore목록_조회
   * @param user_id 유저 아이디
   * @returns RegularStore[]
   */
  async getRegularStoreIdList(user_id: number): Promise<RegularStore[]> {
    const rawRegularStoreList = await this.regularStoreRepository
      .createQueryBuilder('regular_store')
      .where('regular_store.user_id=:user_id', { user_id: user_id })
      .getMany();

    return rawRegularStoreList;
  }

  async getRegularStoreList(user_id: number): Promise<GetStoreListRes[]> {
    const rawRegularStoreList = await this.regularStoreRepository
      .createQueryBuilder('regular_store')
      .where('regular_store.user_id=:user_id', { user_id: user_id })
      .getMany();

    if (rawRegularStoreList.length === 0) {
      return [];
    } else {
      const regularStoreList: GetStoreListRes[] = [];

      for (let i = 0; i < rawRegularStoreList.length; i += 1) {
        const rawStore = await this.storeService.getStore(
          rawRegularStoreList[i].store_id,
        );

        if (rawStore !== undefined) {
          const store: GetStoreListRes = {
            store_address: rawStore.store_address,
            store_bank: rawStore.store_bank,
            store_business_date: rawStore.store_business_date,
            store_business_image: rawStore.store_business_image,
            store_business_number: rawStore.store_business_number,
            store_business_owner_birthday:
              rawStore.store_business_owner_birthday,
            store_business_owner_name: rawStore.store_business_owner_name,
            store_business_store_address: rawStore.store_business_store_address,
            store_business_store_name: rawStore.store_business_store_name,
            store_close_time: rawStore.store_close_time,
            store_id: rawStore.store_id,
            store_image: rawStore.store_image,
            store_is_delivery: rawStore.store_is_delivery,
            store_is_open: rawStore.store_is_open,
            store_name: rawStore.store_name,
            store_open_time: rawStore.store_open_time,
            store_paymethod: rawStore.store_paymethod,
            store_phone: rawStore.store_phone,
            store_star_point: rawStore.store_star_point,
          };

          regularStoreList.push(store);
        }
      }

      // store_id 를 기준으로 오름차순 정렬
      const sortingField = 'store_id';
      regularStoreList.sort((a, b) => {
        return a[sortingField] - b[sortingField];
      });

      return regularStoreList;
    }
  }

  async addRegularStore(user_id: number, store_id: number): Promise<any> {
    const user = await this.getUserByUserId(user_id);

    const dupCheck = await this.regularStoreRepository.findOne({
      user: user,
      store_id: store_id,
    });

    if (!dupCheck) {
      const regularStore = await this.regularStoreRepository.create({
        store_id: store_id,
        user: user,
      });

      await this.regularStoreRepository.save(regularStore);
    } else {
      throw new Error(
        `[addRegularStore Error] already registered with user_id: ${user_id}, store_id: ${store_id}.`,
      );
    }
  }

  async removeRegularStore(user_id: number, store_id: number): Promise<any> {
    const deleteTarget = await this.regularStoreRepository
      .createQueryBuilder('regular_store')
      .where('regular_store.user_id=:user_id', { user_id: user_id })
      .andWhere('regular_store.store_id=:store_id', { store_id: store_id })
      .getOne();

    console.log('removeRegularStore - deleteTarget:', deleteTarget);

    if (deleteTarget) {
      try {
        await this.regularStoreRepository.remove(deleteTarget);
      } catch {
        throw new Error(
          `[removeRegularStore Error] deletion error with user_id: ${user_id}, store_id: ${store_id}.`,
        );
      }
    }
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
  private async getUserByUserId(userId: number): Promise<UserProfile | null> {
    const user = await this.userRepository.findOne(userId);

    if (user) {
      const { user_password, ...res } = user;

      return res;
    } else {
      throw new Error(
        `[getUserByUserId Error] no user was found by user_id: ${userId}`,
      );
    }
  }

  /**
   * user_email 를 통한 user 단건 조회
   * @param userEmail user_email
   * @returns CreateLocalUserRes;
   */
  private async getUserByUserEmail(
    userEmail: string,
  ): Promise<UserProfile | null> {
    const user = await this.userRepository.findOne({ user_email: userEmail });

    if (user) {
      const { user_password, ...res } = user;

      return res;
    } else {
      throw new Error(
        `[getUserByUserEmail Error] no user was found by user_email: ${userEmail}`,
      );
    }
  }
}
