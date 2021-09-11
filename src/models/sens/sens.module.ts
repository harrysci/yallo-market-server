// import { Module } from '@nestjs/common';
// import { SensModule } from 'nest-sens';
// import { SensService } from './sens.service';
// import { SensController } from './sens.controller';

// @Module({
//   imports: [
//     SensModule.forRoot({
//       accessKey: 'hgoJkS3cThzTsg6UKCct',
//       secretKey: 'QVGo1OnuMp1gpZLb9sbvMZb1HIhIvpg4plIaGn6N',
//       sms: {
//         smsServiceId: 'ncp:sms:kr:263299669403:yallo',
//         smsSecretKey: '9067478ac7b04c00a6fd5fcdfe75ae3e',
//         callingNumber: '01037091883',
//       },
//       alimtalk: {
//         alimtalkServiceId: 'ALIMTALK_SERVICE_ID',
//         plusFriendId: 'PLUS_FRIEND_ID',
//       },
//     }),
//   ],
//   providers: [SensService],
//   controllers: [SensController],
// })
// export default class SensModules {}

import { Module } from '@nestjs/common';
import { SensModule } from 'nest-sens';
import { SensService } from './sens.service';
import { SensController } from './sens.controller';

@Module({
  imports: [
    SensModule.forRoot({
      accessKey: process.env.accessKey,
      secretKey: process.env.secretKey,
      sms: {
        smsServiceId: process.env.smsServiceId,
        smsSecretKey: process.env.smsSecretKey,
        callingNumber: process.env.callingNumber,
      },
      alimtalk: {
        alimtalkServiceId: 'ALIMTALK_SERVICE_ID',
        plusFriendId: 'PLUS_FRIEND_ID',
      },
    }),
  ],
  providers: [SensService],
  controllers: [SensController],
})
export default class SensModules {}
