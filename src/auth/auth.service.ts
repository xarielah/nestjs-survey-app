import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from 'src/db/session.service';
import { UserService } from 'src/db/user.service';
import { VerificationTokenService } from 'src/db/verification-token.service';
import { TokenService } from '../token/token.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { BcryptService } from './strategy/bcrypt.service';
import { LoggedUserPayload } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly verificationService: VerificationTokenService,
  ) {}

  /**
   * Implements the user registration business logic.
   * @param {RegisterUserDto} user
   * @returns any
   */
  public async registerUser(user: RegisterUserDto) {
    // If user creation has succeeded, we return a success message.
    const tokenPayload = await this.userService.create(user);
    if (tokenPayload) {
      return this.verificationService.createVerificationToken(tokenPayload);
    }

    // Incase we didn't create the user, we throw an error.
    throw new BadRequestException();
  }

  /**
   * Implements the user login business logic.
   * @param {AuthUserDto} user
   * @returns any
   */
  public async loginUser(user: AuthUserDto): Promise<LoggedUserPayload> {
    const dbUser = await this.userService.get(user);
    // If the user doesn't exist or the password is incorrect, we throw an error.
    if (
      !dbUser ||
      !(await this.bcryptService.compare(user.password, dbUser.password))
    )
      throw new UnauthorizedException();

    // If the user exists and the password is correct, we serialize payload to a token.
    const tokens = await this.sessionService.createSession(dbUser._id, {
      username: dbUser.username,
      email: dbUser.email,
      id: dbUser._id,
      verified: dbUser.verified,
    });
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Implements the user refresh token business logic.
   * @param {string} refreshToken
   * @returns any
   */
  public async refreshUser(
    refreshToken: string,
  ): Promise<Pick<LoggedUserPayload, 'accessToken'>> {
    const payload = await this.tokenService.decodeToken(refreshToken);
    if (!payload) throw new UnauthorizedException();

    const session = await this.sessionService.get(payload.id);
    if (!session) throw new UnauthorizedException();

    const accessToken = await this.tokenService.createAccessToken({
      username: session.username,
      email: session.email,
      id: session.userId,
      verified: session.verified,
    });

    session.accessToken = accessToken;
    await session.save();

    return {
      accessToken: accessToken,
    };
  }

  /**
   * Gets a token and verifies the user.
   * @param {string} token
   */
  public async verifyUser(accessToken: string, token: string): Promise<string> {
    if (!token) throw new BadRequestException();
    try {
      const payload = await this.tokenService.decodeToken(accessToken);
      // Verify the token's signature and expiration, and also that the requestor is the same user we're verifiying.
      const isVerified =
        await this.verificationService.verifyUserTokenAndRequestor(
          payload.id,
          token,
        );
      // True for success, false for failure.
      if (!isVerified) throw new ForbiddenException();
      // Update the user's record verified state first.
      await this.userService.updateUserVerifiedState(payload.id);
      // Remove the verification token record.
      await this.verificationService.removeToken(payload.id);
      // Create a new access token for the user.
      const newAccessToken = await this.tokenService.createAccessToken({
        username: payload.username,
        email: payload.email,
        id: payload.id,
        verified: true,
      });
      // Update the user's session with the new access token.
      await this.sessionService.updateToken(payload.id, newAccessToken);
      // Return the new access token.
      return newAccessToken;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
