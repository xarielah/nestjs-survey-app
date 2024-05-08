import { Schema, model, models } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Session = models.Session || model('Session', sessionSchema);
