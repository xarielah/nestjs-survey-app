import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UpdateSurveyFields } from '../types/survey.types';

/**
 * Data transfer object for updating a survey,
 * we don't want to update the questions here!
 */
export class UpdateSurveyDTO implements UpdateSurveyFields {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(128)
  name: string;

  @IsDateString()
  @IsOptional()
  endDate: string;

  @IsString()
  @IsOptional()
  @MaxLength(512)
  description: string;
}
