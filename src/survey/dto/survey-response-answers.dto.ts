import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SurveyResponseAnswersDTO {
  @IsString()
  @Length(32)
  questionId: string;
  @IsString()
  @IsNotEmpty()
  value: string;
}
