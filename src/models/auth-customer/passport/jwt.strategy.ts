import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { userJwtConstants } from '../constants/userJwtConstants';
import { JWTPayload } from '../interfaces/user-token-payload.interface';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userJwtConstants.secret,
    });
  }

  async validate(payload: JWTPayload) {
    return payload;
  }
}
