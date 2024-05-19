import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { AuthedRequest } from '../types/auth.types';

@Injectable()
export class VerifiedUsersGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as AuthedRequest;
    const accessToken = request.cookies['accessToken'];
    if (!accessToken) return false;
    const isVerified = await this.tokenService.verify(accessToken);
    if (!isVerified) return false;
    const payload = await this.tokenService.decodeToken(accessToken);
    if (!payload || !payload.verified)
      throw new UnauthorizedException('You must be verified to access this');
    request.user = payload;
    return true;
  }
}
