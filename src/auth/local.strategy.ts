import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entitiy';

/**
 *  Local strategy restrict signature of validate method to only 'username' and 'password'
 *  - ref: https://github.com/nestjs/docs.nestjs.com/issues/875
 *  - ref: https://stackoverflow.com/a/65549103/16124226
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   *  Passport will build a user object based on the return value of our validate() method,
   *  and attach it as a property on the Request object.
   */
  async validate(username: string, password: string): Promise<Partial<User>> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
