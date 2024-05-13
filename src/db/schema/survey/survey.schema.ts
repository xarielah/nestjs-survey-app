import { Schema, model, models } from 'mongoose';

const surveySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 128,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      maxlength: 512,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SurveyQuestion',
        required: true,
      },
    ],
  },
  { timestamps: true },
);

export const Survey = models.Survey || model('Survey', surveySchema);
