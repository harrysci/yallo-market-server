import { Inject, Injectable } from '@nestjs/common';
import { AlimtalkClient, SmsClient } from 'nest-sens';

@Injectable()
export class SensService {
  constructor(
    @Inject(AlimtalkClient) private readonly alimtalkClient: AlimtalkClient,
    @Inject(SmsClient) private readonly smsClient: SmsClient,
  ) {}

  async sendAlimtalk(templateCode: string, to: string, content: string) {
    await this.alimtalkClient.send({
      templateCode,
      messages: [{ to, content }],
    });
  }

  async sendSms(to: string, content: string) {
    await this.smsClient.send({ to, content });
  }
}
