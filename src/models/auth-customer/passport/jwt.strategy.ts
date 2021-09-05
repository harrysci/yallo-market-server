// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt } from 'passport-jwt';
// import { Strategy } from 'passport-local';
// import { userJwtConstants } from '../constants/userJwtConstants';

// @Injectable()
// export class JwtUserStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: userJwtConstants.secret,
//     });
//   }

//   async validate(payload: any) {
//     console.log('jwt validate ...');

//     return { user_email: payload.user_email, user_id: payload.sub };
//   }
// }

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { userJwtConstants } from '../constants/userJwtConstants';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userJwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log('jwt validate ...');

    return { username: payload.username, userId: payload.sub };
  }
}
