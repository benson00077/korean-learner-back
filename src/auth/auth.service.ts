import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService){}

  private async validateUser(email: string, password: string): Promise<any>{
    const user = await this.userService.findOneByEmail(email);
    if (user && user.hash === password) {
      const { hash, ...result} = user;
      return result 
    }
    return null
  }
}
