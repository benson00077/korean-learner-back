import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //TODO: use Config service
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   *  Passport will build a user object based on the return value of our validate() method,
   *  and attach it as a property on the Request object.
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
