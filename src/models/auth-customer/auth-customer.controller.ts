import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCustomerService } from './auth-customer.service';
import { CreateLocalUserReq } from './dto/CreateLocalUserReq.dto';
import { CreateLocalUserRes } from './dto/CreateLocalUserRes.dto';
import { User } from './entities/user.entity';

@Controller('auth-customer')
export class AuthCustomerController {
  constructor(private readonly authCustomerService: AuthCustomerService) {}

  @UseGuards(AuthGuard('local'))
  @Post('local')
  async login(@Req() req) {
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
