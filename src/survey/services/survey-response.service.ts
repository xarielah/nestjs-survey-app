import { BadRequestException, Injectable } from '@nestjs/common';
import { SurveyAnswer } from 'src/db/schema/survey/survey-answer.schema';
import { SurveyResponse } from 'src/db/schema/survey/survey-response.schema';
import { SurveyQuestion } from '../types/survey-question.types';
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

  /**
   * Checks if the questions and answers are valid.
   * @param {ObjectId[]} surveyQuestions
   * @param {string[]} surveyAnswers
   * @returns boolean
   */
  private isQuestionsAndAnswersValid(
    surveyQuestions: string[],
    surveyAnswers: string[],
  ): boolean {
    if (surveyQuestions.length != surveyAnswers.length)
      throw new BadRequestException('Invalid number of answers given');
    return surveyQuestions.every((q) => surveyAnswers.includes(q.toString()));
  }

  public async createResponse(
    sQuestions: SurveyQuestion[],
    answers: SurveyRawAnswer[],
    surveyId: string,
    userId: string,
  ): Promise<any> {
    const a = answers.map((a) => a.questionId);
    const q = sQuestions.map((q) => q._id.toString());
    if (!this.isQuestionsAndAnswersValid(q, a))
      throw new BadRequestException(
        "Invalid questions id given in the response aren't matching the survey questions",
      );
    const newResponse = new SurveyResponse({ survey: surveyId, user: userId });
    const ans = await this.createAnswers(answers, newResponse._id.toString());
    newResponse.answers = ans.map((a) => a._id.toString());
    await newResponse.save();
    return newResponse._id.toString();
  }
}
