import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoggedUserPayload } from '../auth/types/auth.types';
import { TokenPayload } from './token.types';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Gets a payload and return a signed JWT, with a 1 day expiration time.
   * @param {TokenPayload} payload
   * @returns token
   */
  public async createAccessToken(payload: TokenPayload): Promise<string> {
    return this.sign(payload, '600s');
  }

  public async decodeToken(token: string): Promise<TokenPayload> {
    if (!token) return null;
    return this.jwtService.decode(token) as TokenPayload;
  }

  /**
   * Gets a payload and return a signed JWT, with a 180 days expiration time.
   * @param {TokenPayload} payload
   * @returns token
   */
  public async createRefreshToken(payload: TokenPayload): Promise<string> {
    return this.sign(payload, '180d');
  }

  /**
   * Gets an access token, validates it, and returns it if valid. If not valid, it creates a new access token.
   * @param {string} token
   * @param {TokenPayload} payload
   * @returns token
   */
  public async validateOrAssignAccessToken(
    token: string,
    payload: TokenPayload,
  ): Promise<string> {
    if (await this.verify(token)) return token;
    return await this.createAccessToken(payload);
  }

  /**
   * Gets an access token, validates it, and returns it if valid. If not valid, it creates a new refresh token.
   * @param {string} token
   * @param {TokenPayload} payload
   * @returns token
   */
  public async validateOrAssignRefreshToken(
    token: string,
    payload: TokenPayload,
  ): Promise<string> {
    if (await this.verify(token)) return token;
    return await this.createRefreshToken(payload);
  }

  /**
   * Gets a payload and returns an object with access and refresh token as properties.
   * @param {TokenPayload} payload
   * @returns accessToken and refreshToken object
   */
  public async createTokens(payload: TokenPayload): Promise<LoggedUserPayload> {
    return {
      accessToken: await this.createAccessToken(payload),
      refreshToken: await this.createRefreshToken(payload),
    };
  }

  /**
   * Gets a payload and a expiration time and return a signed JWT.
   * @param {TokenPayload} payload
   * @param {string} exp
   * @returns token
   */
  public async sign(payload: TokenPayload, exp: string): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: exp,
    });
  }

  public async verify(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
