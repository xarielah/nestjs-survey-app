import { Injectable } from '@nestjs/common';
import { SurveyQuestion } from 'src/db/schema/survey/survey-question.schema';
import { CreateSurveyQuestion } from '../types/survey-question.types';

@Injectable()
export class SurveyQuestionService {
  public async createQuestions(
    surveyId: string,
    questions: CreateSurveyQuestion[],
  ): Promise<string[]> {
    const qs = questions.map((q) => ({ ...q, survey: surveyId }));
    const createdQuestions = await SurveyQuestion.insertMany(qs);
    return createdQuestions.map((q) => q._id.toString());
  }

  public async deleteAllRelatedQuestions(
    surveyId: string,
  ): Promise<{ message: string }> {
    await SurveyQuestion.deleteMany({ survey: surveyId });
    return { message: 'Questions deleted successfuly' };
  }
}
