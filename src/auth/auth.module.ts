import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/db/database.module';
import { UserService } from 'src/db/user.service';
import { VerificationTokenService } from 'src/db/verification-token.service';
import { TokenModule } from '../token/token.module';
import { TokenService } from '../token/token.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from './strategy/bcrypt.service';

@Module({
  controllers: [AuthController],
  imports: [
    TokenModule,
    DatabaseModule,
    JwtModule.register({ secret: process.env.JWT_SECRET || '', global: true }),
  ],
  providers: [
    AuthService,
    BcryptService,
    UserService,
    TokenService,
    VerificationTokenService,
  ],
})
export class AuthModule {}
