import {
  BadRequestException,
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
import { MustBeVerified } from 'src/auth/guards/must-be-verified.guard';
import { AuthedRequest } from 'src/auth/types/auth.types';
import { CreateSurveyDTO } from './dto/create-survey.dto';
import { SurveyResponseDTO } from './dto/survey-response.dto';
import { SurveyService } from './services/survey.service';

@Controller('survey')
@UseGuards(MustBeVerified)
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get('/:id')
  async getSurveyById(@Param('id') surveyId: string) {
    return await this.surveyService.get(surveyId);
  }

  @Get('/:id/questions')
  async getQuestionsBySurveyId(@Param('id') surveyId: string) {
    if (!surveyId) throw new BadRequestException('Survey id is required');
    return '';
  }

  @Patch('/:id')
  async updateSurvey(@Param('id') surveyId: string, @Body() survey: any) {
    if (!surveyId) throw new BadRequestException('Survey id is required');
    if (!survey) throw new BadRequestException('Survey data is required');
    return '';
  }

  // Have this POST over the /:id one.
  @Post()
  async createSurvey(
    @Body() survey: CreateSurveyDTO,
    @Req() req: AuthedRequest,
  ) {
    return await this.surveyService.createSurvey(survey, req.user.id);
  }

  // This should be under the /create endpoint.
  @Post('/:id')
  async submitSurveyResponse(
    @Body() surveyResponse: SurveyResponseDTO,
    @Param('id') surveyId: string,
    @Req() req: AuthedRequest,
  ) {
    return await this.surveyService.submitSurveyResponse(
      surveyResponse,
      surveyId,
      req.user.id,
    );
  }

  @Delete('/:id')
  async deleteSurvey(@Param('id') surveyId: string) {
    return true;
  }
}
