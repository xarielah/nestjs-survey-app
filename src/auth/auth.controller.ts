import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoggedUsersGuard } from './guards/logged-users.guard';
import { MustNotBeLogged } from './guards/must-not-be-logged.guard';
import { AuthedRequest } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(MustNotBeLogged)
  @Post('login')
  public async login(@Body() user: AuthUserDto, @Res() res: Response) {
    const tokens = await this.authService.loginUser(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.json(tokens);
  }

  @UseGuards(MustNotBeLogged)
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  public async register(@Body() user: RegisterUserDto) {
    const verificationToken = await this.authService.registerUser(user);
    return {
      message:
        'On real-world application, verification email would be sent instead of this',
      verificationToken:
        'http://localhost:3000/auth/verify?token=' + verificationToken,
    };
  }

  @UseGuards(LoggedUsersGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('logout')
  public async logout(@Res() res: Response) {
    res.cookie('accessToken', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: new Date(0),
    });
    return res.send();
  }

  @UseGuards(LoggedUsersGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh')
  public async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const tokens = await this.authService.refreshUser(
        req.cookies['refreshToken'],
      );

      res.cookie('accessToken', tokens.accessToken);
      return res.json(tokens);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Get('verify')
  public async verify(
    @Query('token') token: string,
    @Req() req: AuthedRequest,
    @Res() res: Response,
  ) {
    const newAccessToken = await this.authService.verifyUser(token, req.user);
    // If the user is the same as the one in the token, we update the access token.
    if (newAccessToken) {
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    }
    return res.json({ message: 'User verified successfully' });
  }
}
