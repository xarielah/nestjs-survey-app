import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../../token/token.service';
import { AuthedRequest } from '../types/auth.types';

@Injectable()
export class LoggedUsersGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as AuthedRequest;
    const accessToken = request.cookies['accessToken'];
    if (!accessToken) return false;
    const isVerified = await this.tokenService.verify(accessToken);
    if (!isVerified) return false;
    const payload = await this.tokenService.decodeToken(accessToken);
    if (!payload) return false;
    // We attach the user payload to the request object.
    request.user = payload;
    return true;
  }
}
