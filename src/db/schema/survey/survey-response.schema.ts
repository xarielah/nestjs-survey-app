import { Schema, model, models } from 'mongoose';

const surveyResponseSchema = new Schema(
  {
    survey: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SurveyAnswer',
      },
    ],
  },
  { timestamps: true },
);

export const SurveyResponse =
  models.SurveyResponse || model('SurveyResponse', surveyResponseSchema);
