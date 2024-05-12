import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../../token/token.service';

@Injectable()
export class MustNotBeLogged implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const accessToken = request.cookies['accessToken'];
    if (!accessToken) return true;
    const isVerified = await this.tokenService.verify(accessToken);
    if (!isVerified) return true;
    throw new ForbiddenException('You are already logged in');
  }
}
