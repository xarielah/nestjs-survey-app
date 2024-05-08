import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoggedUserPayload } from 'src/auth/types/auth.types';
import { TokenService } from 'src/token/token.service';
import { TokenPayload } from 'src/token/token.types';
import { Session } from './schema/auth/session.schema';

@Injectable()
export class SessionService {
  constructor(private readonly tokenService: TokenService) {}

  /**
   * Gets a user id and return it's session information.
   * @param {string} userId
   * @returns Session or null
   */
  public async get(userId: string): Promise<any> {
    try {
      return await Session.findOne({ userId })
        .select(['accessToken', 'refreshToken', 'userId'])
        .exec();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Gets a user id and a payload, and creates a session for the user.
   * @param {string} userId
   * @param {TokenPayload} payload
   * @returns token object
   */
  public async createSession(
    userId: string,
    payload: TokenPayload,
  ): Promise<any> {
    return await this.upsertTokens(userId, payload);
  }

  /**
   * Get a user id and a payload, and upsert the session with the new payload.
   * @param {string} userId
   * @param {TokenPayload} payload
   * @returns
   */
  public async upsertTokens(
    userId: string,
    payload: TokenPayload,
  ): Promise<LoggedUserPayload> {
    try {
      // get session from the db, upsert the session with the new payload
      const session = await this.get(userId);
      if (!session) {
        const tokens = await this.tokenService.createTokens(payload);
        const newSession = new Session({
          userId,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        await newSession.save();
        return {
          accessToken: newSession.accessToken,
          refreshToken: newSession.refreshToken,
        };
      }

      const accessToken = await this.tokenService.validateOrAssignAccessToken(
        session.accessToken,
        payload,
      );

      if (!(await this.tokenService.verify(session.refreshToken))) {
        session.refreshToken =
          await this.tokenService.createRefreshToken(payload);
        await session.save();
      }

      if (accessToken != session.accessToken) {
        session.accessToken = accessToken;
        await session.save();
      }
      return {
        accessToken: accessToken,
        refreshToken: session.refreshToken,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  public async revokeToken(userId: string): Promise<boolean> {
    try {
      if (await Session.deleteOne({ userId }).exec()) return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets a user id and a token, and updates the session with the new token.
   * @param {string} userId
   * @param {string} token
   * @returns boolean
   */
  public async updateToken(userId: string, token: string): Promise<boolean> {
    try {
      const session = await this.get(userId);
      if (!session) return false;
      session.accessToken = token;
      await session.save();
      return true;
    } catch (error) {
      return false;
    }
  }
}
