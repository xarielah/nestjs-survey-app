import { Module } from '@nestjs/common';
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
  ],
  controllers: [SurveyController],
})
export class SurveyModule {}
