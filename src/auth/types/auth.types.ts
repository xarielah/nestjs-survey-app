import { Request } from 'express';
import { TokenPayload } from 'src/token/token.types';

export type LoggedUserPayload = {
  accessToken: string;
  refreshToken: string;
};

export type UserAccount = {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthedRequest = Request & { user: TokenPayload };
