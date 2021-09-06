import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Username } from 'aws-sdk/clients/appstream';
import { AuthCustomerService } from './auth-customer.service';
import { CreateLocalUserReq } from './dto/CreateLocalUserReq.dto';
import { CreateLocalUserRes } from './dto/CreateLocalUserRes.dto';
import { User } from './entities/user.entity';
import { LocalAuthCustomerGuard } from './guards/auth-customer.guard';
import { JwtUserAuthGuard } from './guards/jwt-auth-customer.guard';

@Controller('auth-customer')
export class AuthCustomerController {
  constructor(private readonly authCustomerService: AuthCustomerService) {}

  /**
   * local login
   * @param req
   * @returns { access_token };
   */
  @UseGuards(LocalAuthCustomerGuard)
  @Post('local')
  async login(@Req() req) {
    return this.authCustomerService.login(req.user);
  }

  /**
   * local login test
   * @param req access_token
   * @returns { Username, userId }
   */
  @UseGuards(JwtUserAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
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
