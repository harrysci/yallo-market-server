// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Owner } from './entities/owner.entity';
// import { OwnerBase } from './interfaces/owner.interface';
// import { JwtService } from '@nestjs/jwt';
// @Injectable()
// export class AuthOwnerService extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectRepository(Owner)
//     private readonly ownerRepository: Repository<Owner>,
//     private jwtService: JwtService,
//   ) {
//     super();
//   }

//   /* test dummy owner */

//   private readonly owners = [
//     {
//       owner_id: 1,
//       password: 'test123',
//       username: 'tkddms',
//       owner_gender: 'else',
//       owner_birthday: new Date(1700, 11, 17),
//       owner_email: 'baycat1212@gmail.com',
//       owner_phone: '01000000000',
//       owner_address: '부산시 금정구 부산대학로 50번길 68',
//       owner_identification_image: 'img:base64',
//       owner_created_at: new Date(),
//     },
//     {
//       owner_id: 2,
//       password: 'test123',
//       username: 'dPsk',
//       owner_gender: 'female',
//       owner_birthday: new Date(1800, 11, 17),
//       owner_email: 'baycat1212@gmail.com',
//       owner_phone: '01000000000',
//       owner_address: '부산시 금정구 부산대학로 50번길 68',
//       owner_identification_image: 'img:base64',
//       owner_created_at: new Date(),
//     },
//   ];
//   async findOne(username: string): Promise<any | undefined> {
//     return this.owners.find((owner) => owner.username === username);
//   }

//   async validateUser(username: string, password: string): Promise<any> {
//     const owner = await this.findOne(username);
//     if (owner && owner.password === password) {
//       const { password, ...result } = owner;
//       return result;
//     }
//     return null;
//   }

//   /*
//    local 회원 로그인 test
//    */
//   async validate(username: string, password: string): Promise<any> {
//     const owner = await this.validateUser(username, password);
//     if (!owner) {
//       throw new UnauthorizedException();
//     }
//     return owner;
//   }

//   /* login 토큰발급*/
//   async login(user: any) {
//     const payload = { username: user.username, sub: user.owner_id };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }
// }

import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';

@Injectable()
export class AuthOwnerService extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {
    super();
  }
}
