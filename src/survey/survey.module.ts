import { Module } from '@nestjs/common';
import { MustBeVerified } from 'src/auth/guards/must-be-verified.guard';
import { TokenService } from 'src/token/token.service';
import { SurveyQuestionService } from './services/survey-question.service';
import { SurveyResponseService } from './services/survey-response.service';
import { SurveyService } from './services/survey.service';
import { SurveyController } from './survey.controller';

@Module({
  providers: [
    SurveyService,
    SurveyQuestionService,
    MustBeVerified,
    TokenService,
    SurveyResponseService,
  ],
  controllers: [SurveyController],
})
export class SurveyModule {}
