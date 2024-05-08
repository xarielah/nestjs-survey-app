import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { DemoModule } from './demo/demo.module';
import { routes } from './routes';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    DemoModule,
    SurveyModule,
    RouterModule.register(routes),
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
