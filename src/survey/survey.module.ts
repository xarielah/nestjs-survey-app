import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TokenService } from 'src/token/token.service';
import { SurveyQuestionService } from './services/survey-question.service';
import { SurveyResponseService } from './services/survey-response.service';
import { SurveyService } from './services/survey.service';
import { SurveyController } from './survey.controller';

@Module({
  providers: [
    SurveyService,
    SurveyQuestionService,
    TokenService,
    SurveyResponseService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  controllers: [SurveyController],
})
export class SurveyModule {}
