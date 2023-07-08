import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  UseFilters,
  Request,
} from '@nestjs/common';
import { TypeormFilter } from 'src/common/exceptions/typeorm/typeorm.filter';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { passportUser } from './interface/passport.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  @UseFilters(TypeormFilter)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req): Promise<passportUser> {
    const passportUser: passportUser = req.user
    return passportUser;
  }
}
