import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthCustomerService } from './auth-customer.service';
import { CreateLocalUserReq } from './dto/CreateLocalUserReq.dto';
import { CreateLocalUserRes } from './dto/CreateLocalUserRes.dto';
import { User } from './entities/user.entity';
import { LocalAuthCustomerGuard } from './guards/auth-customer.guard';
import { JwtAuthGuard } from './guards/jwt-auth-customer.guard';

@Controller('auth-customer')
export class AuthCustomerController {
  constructor(private readonly authCustomerService: AuthCustomerService) {}

  @UseGuards(LocalAuthCustomerGuard)
  @Post('local')
  async login(@Req() req) {
    return this.authCustomerService.login(req.user);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('profile')
  // getProfile(@Req() req) {
  //   console.log(req.user);
  //   return req.user;
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('getProfile 진입');
    console.log('req.rawHeaders: ', req.rawHeaders);
    return req.user;
  }

  @Get('all')
  findAll(): Promise<User[]> {
    return this.authCustomerService.findAll();
  }
  @Get('one')
  findOne(@Body() user_email: string): Promise<User> {
    return this.authCustomerService.findOne(user_email);
  }

  @Post()
  async createLocalUser(
    @Body() userData: CreateLocalUserReq,
  ): Promise<CreateLocalUserRes> {
    return await this.authCustomerService.createLocalUser(userData);
  }
}
