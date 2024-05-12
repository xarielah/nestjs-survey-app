import { Injectable } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { TokenPayload } from 'src/token/token.types';
import { VerificationToken } from './schema/auth/verification-token.schema';

@Injectable()
export class VerificationTokenService {
  constructor(private readonly tokenService: TokenService) {}

  /**
   * Gets a payload and return a signed JWT, with a 1 year expiration time.
   * @param {TokenPayload} payload
   * @returns token
   */
  public async createToken(payload: TokenPayload): Promise<string> {
    return this.tokenService.sign(payload, '365d');
  }

  /**
   * Gets a user id and a token, and creates a verification token for the user.
   * @param {TokenPayload} payload
   */
  public async createVerificationToken(payload: TokenPayload): Promise<string> {
    try {
      const token = await this.createToken(payload);
      const vt = new VerificationToken({
        userId: payload.id,
        token,
      });
      await vt.save();
      return token;
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  /**
   * Gets a user id and deletes the verification token record for user.
   * @param {string} userId
   */
  public async removeToken(userId: string): Promise<boolean> {
    return VerificationToken.findOneAndDelete({ userId }).exec();
  }

  private async get(verificationToken: string): Promise<any> {
    return VerificationToken.findOne({ token: verificationToken }).exec();
  }

  /**
   * Gets a verification token and return if is verified (not expired, and signature is authentic).
   * @param {string} verificationToken
   * @returns boolean
   */
  private async verifyToken(verificationToken: string): Promise<boolean> {
    const isVerified = await this.tokenService.verify(verificationToken);
    if (!isVerified) return false;
    const vt = await this.get(verificationToken);
    if (!vt) return false;
    return true;
  }
}
