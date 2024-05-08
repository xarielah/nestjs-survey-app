import { CreateSurveyQuestion, SurveyQuestion } from './survey-question.types';

export type Survey = {
  _id: string;
  name: string;
  description?: string;
  questions: SurveyQuestion[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSurvey = {
  name: string;
  user: string;
  endDate: string;
  description?: string;
  questions: CreateSurveyQuestion[];
};
