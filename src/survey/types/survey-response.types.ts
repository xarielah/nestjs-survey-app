export type SurveyResponse = {
  _id: string;
  survey: string;
  user: string;
  answers: SurveyUserAnswer[];
  createdAt: Date;
  updatedAt: Date;
};

export type SurveyUserAnswer = {
  _id: string;
  surveyResponse: string;
  value: string;
  question: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SurveyRawAnswer = {
  value: string;
  questionId: string;
};
