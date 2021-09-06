import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
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
    return { username: payload.username, userId: payload.sub };
  }
}
