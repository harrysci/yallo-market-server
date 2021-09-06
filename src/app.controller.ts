import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './models/auth-owner/guards/auth-owner.guard';
import { AuthOwnerService } from './models/auth-owner/auth-owner.service';
import { JwtAuthGuard } from './models/auth-owner/guards/jwt-auth.guard';
// import { AuthGuard } from '@nestjs/passport';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authOwnerService: AuthOwnerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('auth-owner/login')
  // async login(@Request() req) {
  //   return this.authOwnerService.login(req.user);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
