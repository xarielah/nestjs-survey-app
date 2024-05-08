import { Injectable } from '@nestjs/common';
import { SurveyAnswer } from 'src/db/schema/survey/survey-answer.schema';
import { SurveyResponse } from 'src/db/schema/survey/survey-response.schema';
import {
  SurveyRawAnswer,
  SurveyUserAnswer,
} from '../types/survey-response.types';

@Injectable()
export class SurveyResponseService {
  public async createAnswers(
    answers: any[],
    reponseId: string,
  ): Promise<SurveyUserAnswer[]> {
    const a = answers.map((a) => ({
      value: a.value,
      question: a.questionId,
      surveyResponse: reponseId,
    }));
    return SurveyAnswer.insertMany(a);
  }

  public async createResponse(
    answers: SurveyRawAnswer[],
    surveyId: string,
    userId: string,
  ): Promise<any> {
    const newResponse = new SurveyResponse({ survey: surveyId, user: userId });
    const ans = await this.createAnswers(answers, newResponse._id.toString());
    newResponse.answers = ans.map((a) => a._id.toString());
    return newResponse.save();
  }
}
