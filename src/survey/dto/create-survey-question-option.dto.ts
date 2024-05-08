import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSurveyQuestionOptionDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  text: string;
  @IsString()
  @MaxLength(24)
  value: string;
}
