import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray } from 'class-validator';
import { SurveyResponseAnswersDTO } from './survey-response-answers.dto';

export class SurveyResponseDTO {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => SurveyResponseAnswersDTO)
  response: SurveyResponseAnswersDTO[];
}
