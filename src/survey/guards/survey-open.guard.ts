import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthedRequest } from 'src/auth/types/auth.types';
import { SurveyService } from '../services/survey.service';

@Injectable()
export class SurveyOpenGuard implements CanActivate {
  constructor(private readonly surveyService: SurveyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the request object from the context.
    const request = context.switchToHttp().getRequest() as AuthedRequest;
    // Check if the survey id is valid.
    this.surveyService.isValidID(request.params.id);
    // Get the survey by the id.
    const survey = await this.surveyService.getOrError(request.params.id);
    // Check if the survey is still open.
    if (!this.surveyService.isSurveyOpen(survey.endDate))
      throw new BadRequestException(
        `Survey id \"${survey._id.toString()}\" is closed`,
      );
    return true;
  }
}
