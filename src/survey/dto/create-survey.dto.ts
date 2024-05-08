import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateSurveyQuestion } from '../types/survey-question.types';
import { CreateSurveyQuestionDTO } from './create-survey-question.dto';

export class CreateSurveyDTO {
  @MinLength(3)
  @MaxLength(128)
  name: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @MaxLength(512)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => CreateSurveyQuestionDTO)
  questions: CreateSurveyQuestion[]; // This should be an array of questions
}
