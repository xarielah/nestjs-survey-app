import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SurveyQuestion } from 'src/db/schema/survey/survey-question.schema';
import { CreateSurveyQuestion } from '../types/survey-question.types';

@Injectable()
export class SurveyQuestionService {
  public async createQuestions(
    surveyId: string,
    questions: CreateSurveyQuestion[],
  ): Promise<string[]> {
    try {
      const createdQuestions = await SurveyQuestion.insertMany(questions);
      return createdQuestions.map((q) => q._id.toString());
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
