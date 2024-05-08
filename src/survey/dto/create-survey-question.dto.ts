import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  CreateSurveyQuestion,
  SurveyQuestionOptions,
} from '../types/survey-question.types';
import { CreateSurveyQuestionOptionDTO } from './create-survey-question-option.dto';

export class CreateSurveyQuestionDTO implements CreateSurveyQuestion {
  @MinLength(3)
  @MaxLength(512)
  @IsString({ message: 'text must be a string' }) // If the front is in hebrew, change to hebrew
  title: string;
  @IsNumber({}, { message: 'order must be a number' }) // If the front is in hebrew, change to hebrew
  order: number;
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => CreateSurveyQuestionOptionDTO)
  options: SurveyQuestionOptions[];
}
