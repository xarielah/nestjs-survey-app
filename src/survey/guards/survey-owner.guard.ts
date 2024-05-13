import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthedRequest } from 'src/auth/types/auth.types';
import { SurveyService } from '../services/survey.service';

@Injectable()
export class SurveyOwnerGuard implements CanActivate {
  constructor(private readonly surveyService: SurveyService) {}

  async canActivate(context: ExecutionContext) {
    // Get the request object from the context.
    const request = context.switchToHttp().getRequest() as AuthedRequest;
    // Check if the survey id is valid.
    this.surveyService.isValidID(request.params.id);
    // Get the survey by the id.
    const survey = await this.surveyService.getOrError(request.params.id);
    // Get the survey by the id and check if the user is the owner of the survey.
    if (survey.user.toString() != request.user.id)
      throw new UnauthorizedException('You are not the owner of this survey');
    request.survey = survey;
    return true;
  }
}
