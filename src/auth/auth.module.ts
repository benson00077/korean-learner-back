import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Module({
  imports:[UsersModule],
  providers: [AuthService]
})
export class AuthModule {}
