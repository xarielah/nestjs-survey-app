import { CreateSurveyQuestion, SurveyQuestion } from './survey-question.types';

export type Survey = {
  _id: string;
  name: string;
  description?: string;
  questions: SurveyQuestion[] | string[];
  createdAt: Date;
  user: string;
  updatedAt: Date;
  endDate: string;
};

export type CreateSurvey = {
  name: string;
  user: string;
  endDate: string;
  description?: string;
  questions: CreateSurveyQuestion[];
};

export type UpdateSurveyFields = {
  name?: string;
  description?: string;
  endDate?: string;
};
