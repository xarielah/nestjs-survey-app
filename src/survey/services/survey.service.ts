import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Error, Types } from 'mongoose';
import { Survey } from 'src/db/schema/survey/survey.schema';
import { SurveyResponseDTO } from '../dto/survey-response.dto';
import { CreateSurvey } from '../types/survey.types';
import { SurveyQuestionService } from './survey-question.service';
import { SurveyResponseService } from './survey-response.service';

@Injectable()
export class SurveyService {
  constructor(
    private readonly surveyQuestionService: SurveyQuestionService,
    private readonly surveyResponseService: SurveyResponseService,
  ) {}

  /**
   * Gets a survey by it's id and returns the survey document, with the questions populated.
   * @param {string} surveyId
   * @returns
   */
  public async get(surveyId: string) {
    if (!surveyId || !Types.ObjectId.isValid(surveyId))
      throw new BadRequestException('Survey id is missing or invalid');
    // Get the survey with the questions populated.
    const aggregateOptions = getSurveyOptions(surveyId);
    const foundSurvey = await Survey.aggregate(aggregateOptions).then(
      (res) => res[0],
    );
    // If the survey is not found, throw a not found exception.
    if (!foundSurvey) throw new NotFoundException();
    return foundSurvey;
  }

  public async getQuestionsBySurveyId(surveyId: string) {
    if (!surveyId) throw new BadRequestException('Survey id is required');
    return '';
  }

  public async updateSurvey(surveyId: string, survey: any) {
    if (!survey) throw new Error('Survey data is required');
    return '';
  }

  /**
   * Gets a survey response and saves it to the database.
   * @param {SurveyResponseDTO} surveyResponse
   * @param {string} surveyId
   * @param {string} userId
   */
  public async submitSurveyResponse(
    surveyResponse: SurveyResponseDTO,
    surveyId: string,
    userId: string,
  ) {
    // Check if the survey id is a valid object id.
    if (!Types.ObjectId.isValid(surveyId))
      throw new BadRequestException(
        'Invalid survey id given, must be a valid id',
      );
    // Check if the survey exists.
    const surveyFound = await Survey.findById(surveyId);
    // If the survey is not found, throw a not found exception.
    if (!surveyFound)
      throw new NotFoundException(`Survey with id \"${surveyId}\"not found`);
    // Check if the survey is still open.
    if (new Date(surveyFound.endDate).getTime() < new Date().getTime()) {
      throw new BadRequestException(
        'Survey is closed and cannot accept new responses',
      );
    }
    // Check if the answers are at the same number of questions.
    if (surveyResponse.response.length != surveyFound.questions.length)
      throw new BadRequestException(
        `Invalid number of answers given {${surveyResponse.response.length}} for survey \"${surveyId}\" with {${surveyFound.questions.length}} questions`,
      );
    const surveyQuestionsArr = surveyFound.questions.map((q) =>
      q._id.toString(),
    );
    const surveyResponseQuestionsArr = surveyResponse.response.map(
      (r) => r.questionId,
    );
    // Check if the questions id's given in the response answers are valid.
    if (
      !this.areQuestionsIdsValid(surveyQuestionsArr, surveyResponseQuestionsArr)
    )
      throw new BadRequestException(
        `Invalid questions id given in the response aren't matching the survey questions`,
      );
    return this.surveyResponseService.createResponse(
      surveyResponse.response,
      surveyId,
      userId,
    );
  }

  private areQuestionsIdsValid(
    questionsFromSurvey: string[],
    questionsFromResponse: string[],
  ): boolean {
    return questionsFromResponse.every((q) => questionsFromSurvey.includes(q));
  }

  /**
   * Creates a survey with the given data and the user id as the owner of the survey.
   * @param {Omer<CreateSurvey, "user">} survey
   * @param {string} userId
   */
  public async createSurvey(
    survey: Omit<CreateSurvey, 'user'>,
    userId: string,
  ): Promise<{ surveyId: string; surveyUrl: string; message: string }> {
    try {
      // Create a "clean" survey object.
      const s: Omit<CreateSurvey, 'questions'> = {
        name: survey.name,
        user: userId,
        description: survey.description,
        endDate: survey.endDate,
      };
      // Creating an independent options matrix, to have an order set.
      const qo = survey.questions.map((q) =>
        q.options.map((o, j) => ({
          text: o.text,
          value: o.value,
          order: j + 1,
        })),
      );
      // Creating the questions array to be inserted on the database.
      const qs = survey.questions.map((q, i) => ({
        title: q.title,
        order: i + 1,
        options: qo[i],
      }));
      // Creating the survey class, we don't insert it yet.
      const newSurvey = new Survey(s);
      // Creating the questions and inserting them on the database.
      const createdQuestions = await this.surveyQuestionService.createQuestions(
        newSurvey._id.toString(),
        qs,
      );
      // Updating the survey with the questions id's array.
      newSurvey.questions = createdQuestions;
      // Inserting the survey on the database.
      await newSurvey.save();
      return {
        surveyId: newSurvey._id.toString(),
        surveyUrl:
          'http://localhost:3000/api/survey/' + newSurvey._id.toString(),
        message:
          'Survey "' + newSurvey._id.toString() + '" created successfuly',
      };
    } catch (error) {
      // Handling the validation errors within a bad request exception.
      if (error.constructor.name == 'ValidationError') {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}

/**
 * Returns the aggregation pipeline for the survey options.
 * @param {string} surveyId
 * @returns aggregate pipeline object
 */
const getSurveyOptions = (surveyId: string) => {
  const sid = new Types.ObjectId(surveyId);
  return [
    // Pipeline stage #1: Get the wanted survey by it's id.
    {
      $match: {
        _id: sid,
      },
    },
    {
      $unset: ['__v'],
    },
    // Pipeline stage #2: Lookup the questions records by oids.
    {
      $lookup: {
        from: 'surveyquestions',
        localField: 'questions',
        foreignField: '_id',
        as: 'questions',
        pipeline: [
          {
            // Exclude the unwanted fields.
            $unset: [
              '__v',
              'surveyId',
              'createdAt',
              'updatedAt',
              'options._id',
              'user',
            ],
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'owner',
        pipeline: [
          {
            // Exclude the unwanted fields.
            $unset: [
              '__v',
              'password',
              'email',
              'updatedAt',
              'createdAt',
              'verified',
            ],
          },
        ],
      },
    },
  ];
};
