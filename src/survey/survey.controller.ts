import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VerifiedUsersGuard } from 'src/auth/guards/verified-users.guard';
import { AuthedRequest } from 'src/auth/types/auth.types';
import { CreateSurveyDTO } from './dto/create-survey.dto';
import { SurveyResponseDTO } from './dto/survey-response.dto';
import { UpdateSurveyDTO } from './dto/update-survey.dto';
import { SurveyOpenGuard } from './guards/survey-open.guard';
import { SurveyOwnerGuard } from './guards/survey-owner.guard';
import { SurveyValidGuard } from './guards/survey-valid.guard';
import { SurveyService } from './services/survey.service';

@UseGuards(VerifiedUsersGuard)
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @UseGuards(SurveyValidGuard)
  @Get('/:id')
  async getSurveyById(@Req() req: AuthedRequest) {
    return req.survey;
  }

  @UseGuards(SurveyOwnerGuard)
  @Patch('/:id')
  async updateSurvey(
    @Param('id') surveyId: string,
    @Body() survey: UpdateSurveyDTO,
  ) {
    return await this.surveyService.updateSurvey(surveyId, survey);
  }

  @Post()
  async createSurvey(
    @Body() survey: CreateSurveyDTO,
    @Req() req: AuthedRequest,
  ) {
    return await this.surveyService.createSurvey(survey, req.user.id);
  }

  @UseGuards(SurveyOpenGuard)
  @Post('/:id')
  async submitSurveyResponse(
    @Body() surveyResponse: SurveyResponseDTO,
    @Req() req: AuthedRequest,
  ) {
    return await this.surveyService.submitSurveyResponse(
      surveyResponse,
      req.survey,
      req.user.id,
    );
  }

  @UseGuards(SurveyOwnerGuard)
  @Post('/:id/end')
  async endSurvey(@Req() req: AuthedRequest) {
    return await this.surveyService.endSurvey(req.survey);
  }

  @UseGuards(SurveyOwnerGuard)
  @Delete('/:id')
  async deleteSurvey(@Req() req: AuthedRequest) {
    return await this.surveyService.deleteSurvey(req.survey);
  }
}
