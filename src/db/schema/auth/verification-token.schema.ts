import { Schema, model, models } from 'mongoose';

const verificationTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const VerificationToken =
  models.VerificationToken ||
  model('VerificationToken', verificationTokenSchema);
