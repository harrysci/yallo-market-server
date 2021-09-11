import { Body, Controller, Post } from '@nestjs/common';
import { SensService } from './sens.service';

@Controller('sens')
export class SensController {
  constructor(private readonly sensService: SensService) {}

  @Post('sendSms')
  sendSms(
    @Body('to') to: string,
    @Body('content') content: string,
  ): Promise<any> {
    return this.sensService.sendSms(to, content);
  }
}
