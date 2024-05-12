import { Schema, model, models } from 'mongoose';

const surveyAnswerSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 512,
    },
    surveyResponse: {
      type: Schema.Types.ObjectId,
      ref: 'SurveyResponse',
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'SurveyQuestion',
      required: true,
    },
  },
  { timestamps: true },
);

export const SurveyAnswer =
  models.SurveyAnswer || model('SurveyAnswer', surveyAnswerSchema);
