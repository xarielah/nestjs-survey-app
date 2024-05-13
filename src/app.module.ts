import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { routes } from './routes';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    SurveyModule,
    RouterModule.register(routes),
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 10,
      },
    ]),
  ],
})
export class AppModule {}
