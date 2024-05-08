export type CreateSurveyQuestion = {
  title: string;
  order: number;
  options: SurveyQuestionOptions[];
};

export type SurveyQuestionOptions = {
  text: string;
  value: string;
  order: number;
};

export type SurveyQuestion = {
  _id: string;
  text: string;
  order: number;
  survey: string;
  createdAt: Date;
  updatedAt: Date;
};
