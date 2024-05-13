import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Types, isValidObjectId } from 'mongoose';
import { Survey } from 'src/db/schema/survey/survey.schema';
import { SurveyResponseDTO } from '../dto/survey-response.dto';
import { SurveyQuestion } from '../types/survey-question.types';
import {
  CreateSurvey,
  UpdateSurveyFields,
  type Survey as SurveyObject,
} from '../types/survey.types';
import { SurveyQuestionService } from './survey-question.service';
import { SurveyResponseService } from './survey-response.service';

@Injectable()
export class SurveyService {
  constructor(
    private readonly surveyQuestionService: SurveyQuestionService,
    private readonly surveyResponseService: SurveyResponseService,
  ) {}

  public async endSurvey(survey: SurveyObject): Promise<{ message: string }> {
    if (!this.isSurveyOpen(survey.endDate))
      throw new BadRequestException(
        `Survey id \"${survey._id.toString()}\" is already closed`,
      );
    await Survey.findByIdAndUpdate(survey._id, { endDate: new Date() });
    return {
      message: `Survey id \"${survey._id.toString()}\" ended successfuly`,
    };
  }

  /**
   * Gets a survey by it's id and returns the survey document, with the questions populated.
   * @param {string} surveyId
   * @returns
   */
  public async get(surveyId: string): Promise<SurveyObject> {
    // Get the survey with the questions populated.
    const aggregateOptions = this.getSurveyOptions(surveyId);
    const foundSurvey = await Survey.aggregate(aggregateOptions);
    return foundSurvey[0];
  }

  public async deleteSurvey(
    survey: SurveyObject,
  ): Promise<{ message: string }> {
    // "Deletes" the survey.
    await Survey.findByIdAndUpdate(survey._id, { isDeleted: true });
    return {
      message: `Survey id \"${survey._id.toString()}\" deleted successfuly`,
    };
  }

  /**
   * Gets a survey by it's id, if it doesn't exist, throws a not found exception.
   * @param {string} surveyId
   */
  public async getOrError(surveyId: string): Promise<SurveyObject> {
    const survey = await this.get(surveyId);
    if (!survey)
      throw new NotFoundException(`Survey id \"${surveyId}\" not found`);
    return survey;
  }

  /**
   * Returns true if the survey id is valid, otherwise throws a bad request exception.
   * @param {string} surveyId
   */
  public isValidID(surveyId: string): boolean {
    if (!isValidObjectId(surveyId))
      throw new BadRequestException(`Survey id \"${surveyId}\" is invalid`);
    return true;
  }

  private areUpdatedFieldsValid(survey: UpdateSurveyFields): boolean {
    return !!(
      Object.keys(survey).length > 0 ||
      survey.name ||
      survey.description ||
      survey.endDate
    );
  }
  /**
   * Gets a survey by it's id and updates the fields with the given survey object.
   * @param {string} surveyId
   * @param {any} survey
   */
  public async updateSurvey(
    surveyId: string,
    survey: any,
  ): Promise<{ message: string }> {
    if (!isValidObjectId(surveyId))
      throw new NotFoundException(`Survey id \"${surveyId}\" not found`);
    // Check if the survey exists.
    const surveyFound = await Survey.findById(surveyId);
    if (!surveyFound)
      throw new NotFoundException(`Survey id \"${surveyId}\" not found`);
    // Check if the fields are valid.
    if (!this.areUpdatedFieldsValid(survey))
      throw new BadRequestException('Invalid fields given');
    // Update the survey fields accordinly.
    surveyFound.name = survey.name || surveyFound.name;
    surveyFound.description = survey.description || surveyFound.description;
    surveyFound.endDate = survey.endDate || surveyFound.endDate;
    await surveyFound.save();
    // Return the message.
    return { message: `Survey \`${surveyId}\` updated successfuly` };
  }

  /**
   * Gets a survey response and saves it to the database.
   * @param {SurveyResponseDTO} surveyResponse
   * @param {SurveyObject} survey
   * @param {string} userId
   */
  public async submitSurveyResponse(
    surveyResponse: SurveyResponseDTO,
    survey: SurveyObject,
    userId: string,
  ) {
    // Create response using the survey response service.
    const responseId = await this.surveyResponseService.createResponse(
      survey.questions as SurveyQuestion[],
      surveyResponse.response,
      survey._id.toString(),
      userId,
    );
    return {
      message: `Survey response id \"${responseId}\" registered successfuly`,
    };
  }
  /**
   * Creates a survey with the given data and the user id as the owner of the survey.
   * @param {Omit<CreateSurvey, "user">} survey
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

  /**
   * Returns if the survey is still open.
   * @param {string} endDate
   * @returns boolean
   */
  public isSurveyOpen(endDate: string): boolean {
    return new Date(endDate) > new Date();
  }

  /**
   * Returns the aggregation pipeline for the survey options.
   * @param {string} surveyId
   * @returns aggregate pipeline object
   */
  private getSurveyOptions(surveyId: string) {
    const sid = new Types.ObjectId(surveyId);
    return [
      // Pipeline stage #1: Get the wanted survey by it's id.
      {
        $match: {
          _id: sid,
          isDeleted: false,
        },
      },
      {
        $unset: ['__v', 'updatedAt'],
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
  }
}
