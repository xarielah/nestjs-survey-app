import { Schema, model, models } from 'mongoose';

const surveyQuestionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 512,
    },
    order: {
      type: Number,
      required: true,
    },
    options: [
      {
        value: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 512,
        },
        order: {
          type: Number,
          required: true,
        },
        text: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 512,
        },
      },
    ],
    survey: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
    },
  },
  { timestamps: true },
);

export const SurveyQuestion =
  models.SurveyQuestion || model('SurveyQuestion', surveyQuestionSchema);
