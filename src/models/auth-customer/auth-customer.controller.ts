import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthCustomerService } from './auth-customer.service';
import { CreateLocalUserReq } from './dto/CreateLocalUserReq.dto';
import { CreateLocalUserRes } from './dto/CreateLocalUserRes.dto';
import { CreateSocialUserReq } from './dto/CreateSocialUserReq.dto';
import { CreateSocialUserRes } from './dto/CreateSocialUserRes.dto';
import { EmailDupleCheckRes } from './dto/EmailDupleCheckRes.dto';
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
  findAll(): Promise<User[]> {
    return this.authCustomerService.findAll();
  }

  @Get('one')
  findOne(@Body() user_email: string): Promise<User> {
    return this.authCustomerService.findOne(user_email);
  }

  @Get('email-duple-check')
  async emailDupleCheck(
    @Query('email') email: string,
    @Query('type') type: 'kakao' | 'apple' | 'local',
  ): Promise<EmailDupleCheckRes> {
    const result = await this.authCustomerService.emailDupleCheck(email, type);
    return result;
  }

  @Post()
  async createLocalUser(
    @Body() userData: CreateLocalUserReq,
  ): Promise<CreateLocalUserRes> {
    return await this.authCustomerService.createLocalUser(userData);
  }

  @Post('social')
  async createSocialUser(
    @Body() userData: CreateSocialUserReq,
  ): Promise<CreateSocialUserRes> {
    return await this.authCustomerService.createSocialUser(userData);
  }
}
