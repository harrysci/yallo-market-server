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
import { GetStoreListRes } from '../store/dto/GetStoreListRes.dto';
import { AuthCustomerService } from './auth-customer.service';
import { ChangePasswordReq } from './dto/ChangePasswordReq.dto';
import { CreateLocalUserReq } from './dto/CreateLocalUserReq.dto';
import { CreateLocalUserRes } from './dto/CreateLocalUserRes.dto';
import { CreateSocialUserReq } from './dto/CreateSocialUserReq.dto';
import { CreateSocialUserRes } from './dto/CreateSocialUserRes.dto';
import { EmailDupleCheckRes } from './dto/EmailDupleCheckRes.dto';
import { RegularStore } from './entities/regular-store.entity';
import { User } from './entities/user.entity';
import { LocalAuthCustomerGuard } from './guards/auth-customer.guard';
import { JwtUserAuthGuard } from './guards/jwt-auth-customer.guard';
import { JWTPayload } from './interfaces/user-token-payload.interface';

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
  async login(@Req() req): Promise<{ access_token: string }> {
    if (req.user) {
      const targetUser: JWTPayload = req.user as JWTPayload;
      return this.authCustomerService.login(targetUser);
    }

    return;
  }

  /**
   * local login test
   * @param req access_token
   * @returns { Username, userId }
   */
  @UseGuards(JwtUserAuthGuard)
  @Get('profile')
  getProfile(@Request() req: Express.Request) {
    if (req.user) {
      const targetUser: JWTPayload = req.user as JWTPayload;
      return this.authCustomerService.getProfile(targetUser.sub);
    }

    return;
  }

  @Get('all')
  async findAll(): Promise<User[]> {
    return await this.authCustomerService.findAll();
  }

  @Get('one')
  async findOne(
    @Body('user_email') user_email: string,
  ): Promise<CreateLocalUserRes> {
    return await this.authCustomerService.findOne(user_email);
  }

  @Get('email-duple-check')
  async emailDupleCheck(
    @Query('email') email: string,
    @Query('type') type: 'kakao' | 'apple' | 'local',
  ): Promise<EmailDupleCheckRes> {
    const result = await this.authCustomerService.emailDupleCheck(email, type);
    return result;
  }

  @Post('create-local-user')
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
    const res = await this.authCustomerService.findUserByEmailAndPhone(
      user_email,
      user_phone,
    );

    return res;
  }

  @Post('create-social-user')
  async createSocialUser(
    @Body() userData: CreateSocialUserReq,
  ): Promise<CreateSocialUserRes> {
    return await this.authCustomerService.createSocialUser(userData);
  }

  // @Post('getRegularStoreList/:userId')
  // async getRegularStoreList(@Param('userId') userId: number): Promise<any> {
  //   return await this.authCustomerService.getRegularStoreList(userId);
  // }

  @Get('regular-store/:user_id')
  async getRegularStore(
    @Query('user_id') user_id: number,
  ): Promise<RegularStore[]> {
    return await this.authCustomerService.getRegularStoreIdList(user_id);
  }

  @Get('getRegularStoreList/:user_id')
  async getRegularStoreList(
    @Param('user_id') user_id: number,
  ): Promise<GetStoreListRes[]> {
    return await this.authCustomerService.getRegularStoreList(user_id);
  }

  @Post('add-regular-store')
  async addRegularStore(
    @Query('user_id') user_id: number,
    @Query('store_id') store_id: number,
  ): Promise<any> {
    return await this.authCustomerService.addRegularStore(user_id, store_id);
  }

  @Post('remove-regular-store')
  async removeRegularStore(
    @Query('user_id') user_id: number,
    @Query('store_id') store_id: number,
  ): Promise<any> {
    return await this.authCustomerService.removeRegularStore(user_id, store_id);
  }
}
