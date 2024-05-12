import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthedRequest } from 'src/auth/types/auth.types';
import { SurveyService } from '../services/survey.service';

@Injectable()
export class SurveyValidGuard implements CanActivate {
  constructor(private readonly surveyService: SurveyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the request object from the context.
    const request = context.switchToHttp().getRequest() as AuthedRequest;
    // Get the user from the request object.
    const surveyId = request.params.id;
    // Check if the survey id is valid.
    this.surveyService.isValidID(surveyId);
    // Get the survey by the id.
    const survey = await this.surveyService.getOrError(surveyId);
    // If the survey is not found, throw a not found exception.
    if (!survey)
      throw new NotFoundException(`Survey with id \"${surveyId}\" not found`);
    // Attach the survey to the request object.
    request.survey = survey;
    return true;
  }
}
