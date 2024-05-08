import { Module } from '@nestjs/common';
import { BcryptService } from 'src/auth/strategy/bcrypt.service';
import { TokenService } from 'src/token/token.service';
import { SessionService } from './session.service';
import { UserService } from './user.service';
import { VerificationTokenService } from './verification-token.service';

@Module({
  exports: [UserService, SessionService, VerificationTokenService],
  providers: [
    UserService,
    SessionService,
    BcryptService,
    TokenService,
    VerificationTokenService,
  ],
})
export class DatabaseModule {}
