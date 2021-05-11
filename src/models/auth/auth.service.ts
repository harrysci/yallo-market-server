import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { iif } from 'rxjs';
import { Repository } from 'typeorm';
import { AccountType } from './constants/accountType.type';

/* User 프로필 Entity */
import { User } from './entities/user.entity';
import { GoogleUserProfile } from './interfaces/GoogleUserProfileType.interface';
import { KakaoUserProfile } from './interfaces/KakaoUserProfileType.interface';

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
   * 단일 유저 프로필 정보 조회
   * @param req 유저 아이디와 계정 타입
   * @returns User Entity 값
   */
  async searchOneUserProfile(req: any) {
    const { userId, accountType } = req;

    const userProfile = await this.userRepository.findOne({
      userId,
      accountType,
    });

    if (userProfile) {
      console.log('[SUCCESS] profile exist');

      return userProfile;
    } else {
      console.log('[FAIL] profile exist');
      return null;
    }
  }

  /**
   * 카카오 API 프로필 데이터를 User Entity 로 맵핑한다.
   * @param kakaoResProfile 카카오 API 프로필 조회 반환 값
   * @returns User Entity 값
   */
  kakaoProfilePreprocessor(kakaoResProfile: KakaoUserProfile) {
    if (kakaoResProfile.id) {
      const newKakaoUserProfile: User = {
        userId: kakaoResProfile.id,
        email: kakaoResProfile.email,
        nickName: kakaoResProfile.nickname,
        gender: kakaoResProfile.gender,
        phone: kakaoResProfile.phoneNumber,

        name: null,
        address: null,
        birthday: null,
        age: null,
        thumbnail: null,

        accountType: 'KAKAO',
      };

      return newKakaoUserProfile;
    } else {
      return null;
    }
  }

  /**
   * 구글 API 프로필 데이터를 User Entity 로 맵핑한다.
   * @param googleResProfile 구글 API 프로필 조회 반환 값
   * @returns User Entity 값
   */
  googleProfilePreprocessor(googleResProfile: GoogleUserProfile) {
    if (googleResProfile.user && googleResProfile.user.id) {
      const googleUser = googleResProfile.user;

      const newGoogleUserProfile: User = {
        userId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,

        nickName: null,
        address: null,
        birthday: null,
        age: null,
        thumbnail: null,
        gender: null,
        phone: null,

        accountType: 'GOOGLE',
      };

      return newGoogleUserProfile;
    } else {
      return null;
    }
  }

  /**
   * 애플 API 프로필 데이터를 User Entity 로 맵핑한다.
   * @param appleResProfile 애플 API 프로필 조회 반환 값
   * @returns User Entity 값
   */
  appleProfilePreprocessor(appleResProfile: GoogleUserProfile) {
    return appleResProfile;
  }

  /**
   * 계정 타입에 따라 데이터 전처리를 적용한다.
   * @param profile 처리되지 않은 프로필 데이터
   * @param accountType 프로필 데이터의 계정 타입
   * @returns User Entity 값
   */
  profilePreprocessor(profile: any, accountType: AccountType) {
    switch (accountType) {
      case 'LOCAL':
        return profile;
      case 'KAKAO':
        return this.kakaoProfilePreprocessor(profile);
      case 'GOOGLE':
        return this.googleProfilePreprocessor(profile);
      case 'APPLE':
        return this.appleProfilePreprocessor(profile);
      default: {
        return null;
      }
    }
  }

  /**
   * 유저 정보 저장
   * @param req 새롭게 등록 할 유저 프로필 정보를 포함한 요청
   * @returns 정상 등록 여부, 등록된 User Entity 값
   */
  async saveUserProfile(req: any) {
    const localTestUser: User = {
      userId: 'test',
      name: 'test',
      nickName: 'test',
      gender: 'test',
      birthday: 'test',
      age: 'test',
      email: 'test',
      phone: 'test',
      address: 'test',
      thumbnail: 'test',
      accountType: 'KAKAO',
      createdAt: 'test',
    };

    const kakaoTestUser: KakaoUserProfile = {
      ageRange: null,
      ageRangeNeedsAgreement: null,
      birthday: '0607',
      birthdayNeedsAgreement: false,
      birthdayType: null,
      birthyear: null,
      birthyearNeedsAgreement: null,
      email: 'qjqdn1568@naver.com',
      emailNeedsAgreement: false,
      gender: null,
      genderNeedsAgreement: false,
      id: '1727765046',
      isEmailValid: true,
      isEmailVerified: true,
      isKorean: null,
      isKoreanNeedsAgreement: null,
      nickname: '김법우',
      phoneNumber: null,
      phoneNumberNeedsAgreement: null,
      profileImageUrl: null,
      profileNeedsAgreement: false,
      thumbnailImageUrl: null,
    };

    const googleTestUser: GoogleUserProfile = {
      idToken:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY5ZWQ1N2Y0MjQ0OTEyODJhMTgwMjBmZDU4NTk1NGI3MGJiNDVhZTAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDA2MzgyNDMyMDQ4LWptamMycmFydGtpYTA1ajZsYWtmZ212NDU3NGE0cmkyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTAwNjM4MjQzMjA0OC05YXJyMm5uaWRiNzN1ZjY5amdjNDgycGZvajYzaG50OS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNzY0OTkxODE5MzgzMDAyMjQyMyIsImVtYWlsIjoicWpxZG4xNTY4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiaW5XVWdGSkgycmd1VmZUSENSWUVBUSIsIm5vbmNlIjoiSVdtT3FfdzdkaW1ETTVkVEd6TW45SXVhVTA0Q1k1QU0yZUYxTllVUWl6QSIsIm5hbWUiOiLquYDrspXsmrAiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFUWEFKdy12eFdDOUY1ZVZsWHNORHBmUmVuWHdQRF9tZzRHSVhzRW1MTHM9czk2LWMiLCJnaXZlbl9uYW1lIjoi67KV7JqwIiwiZmFtaWx5X25hbWUiOiLquYAiLCJsb2NhbGUiOiJrbyIsImlhdCI6MTYyMDcxODUwNSwiZXhwIjoxNjIwNzIyMTA1fQ.kogWEacIfZdlq-Xr5NFWPaUuD_ViujzRsVNAi41Oku8GxZ4nwMPupFTdvoR-ByCyykgzxNSXGEV3wHH7-yzcxKWAYLbj3Je9dVx7R-jcm9ha6LUYae9TxjIAA7tkako7_aONsaOSfMN2yDRFY_GSJ3m_EUOK_I1r0YLKBa_3dvx9fhz5bToHfPXyJa5mnQaEIz0rzcRJpoyBYmTXwsKDg_PcdEqul_86lHIwUFNBYc5S24vWjx4wJC_MxWh_G3MXZxaTFmOCODkYZq21iDmKu2U-NGWVcIeBYVJ_rDi9BfwrrlcQIci9HsfpLf-J4UOFq7QLd_-ASFAMZcSXwARBjw',
      scopes: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      serverAuthCode:
        '4/0AY0e-g7s04_4NV9Os_c7hwxNjH3OF-fgW7L8FyHgnI8lSmgIoPZ-G5_c3uPTzI-_2M8eyQ',
      user: {
        email: 'qjqdn1568@gmail.com',
        familyName: '김',
        givenName: '법우',
        id: '107649918193830022423',
        name: '김법우',
        photo:
          'https://lh3.googleusercontent.com/a/AATXAJw-vxWC9F5eVlXsNDpfRenXwPD_mg4GIXsEmLLs=s120',
      },
    };

    const newUser = this.profilePreprocessor(googleTestUser, 'GOOGLE');

    if (newUser) {
      return this.userRepository.save(newUser);
    } else {
      return null;
    }
  }
}
