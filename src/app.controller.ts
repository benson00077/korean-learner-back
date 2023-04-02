import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //TODO: just for demo here, to be moved to other contorller, to aligned with user controoler url
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    //req.user is created by Passport based on the value we return from the validate() method in LocalStrategy
    return this.authService.login(req.user);
  }

  //TODO: just for demo here, to be moved to other controller, to aligned with user controoler url
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
