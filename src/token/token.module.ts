import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({ secret: process.env.JWT_SECRET || '', global: true }),
  ],
  exports: [TokenService],
  providers: [TokenService],
})
export class TokenModule {}
