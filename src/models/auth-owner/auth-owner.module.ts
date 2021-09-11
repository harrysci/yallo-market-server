// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthOwnerService } from './auth-owner.service';
// import { Owner } from './entities/owner.entity';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './constants';
// import { JwtStrategy } from './jwt.strategy';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Owner]),
//     PassportModule,
//     JwtModule.register({
//       secret: jwtConstants.secrete,
//       signOptions: { expiresIn: '60s' },
//     }),
//   ],
//   exports: [AuthOwnerService, JwtModule],
//   providers: [AuthOwnerService, JwtStrategy],
// })
// export class AuthOwnerModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthOwnerService } from './auth-owner.service';
import { Owner } from './entities/owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Owner])],
  exports: [AuthOwnerService],
  providers: [AuthOwnerService],
})
export class AuthOwnerModule {}
