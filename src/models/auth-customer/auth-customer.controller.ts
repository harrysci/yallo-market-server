import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthCustomerService } from './auth-customer.service';
import { ChangePasswordReq } from './dto/ChangePasswordReq.dto';
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
  async findAll(): Promise<User[]> {
    return await this.authCustomerService.findAll();
  }

  @Get('one')
  async findOne(
    @Body('user_email') user_email: string,
  ): Promise<CreateLocalUserRes> {
    console.log('findone controller');
    return await this.authCustomerService.findOne(user_email);
  }

  @Post('create-user')
  async createLocalUser(
    @Body() userData: CreateLocalUserReq,
  ): Promise<CreateLocalUserRes> {
    return await this.authCustomerService.createLocalUser(userData);
  }

  @Get('get-auth-number')
  async getAuthNumber(): Promise<string> {
    return await this.authCustomerService.getAuthNumber();
  }

  @Get('get-user-email/:user_phone')
  async getUserEmailByPhoneNumber(
    @Param('user_phone') user_phone: string,
  ): Promise<any> {
    return await this.authCustomerService.getUserEmailByPhoneNumber(user_phone);
  }

  @Put('update-user-password')
  async updateUserPassword(@Body() userData: ChangePasswordReq): Promise<any> {
    return await this.authCustomerService.updateUserPassword(userData);
  }

  @Get('find-user-by-email-phone')
  async findUserByEmailAndPhone(
    @Query('user_email') user_email: string,
    @Query('user_phone') user_phone: string,
  ): Promise<boolean> {
    console.log('findone controller');
    const res = await this.authCustomerService.findUserByEmailAndPhone(
      user_email,
      user_phone,
    );

    console.log('res: ', res);
    console.log(user_email);
    return res;
  }
}
