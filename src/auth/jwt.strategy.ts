import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtPayload } from './interface/jwt-payload.interface';
import { passportUser } from './interface/passport.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  /**
   *  Passport will build a user object based on the return value of our validate() method,
   *  and attach it as a property on the Request object.
   */
  async validate(payload: jwtPayload): Promise<passportUser> {
    return { userId: payload.sub, username: payload.username };
  }
}
