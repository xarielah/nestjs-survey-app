import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../../token/token.service';

@Injectable()
export class MustNotBeLogged implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const response = context.switchToHttp().getResponse();
    try {
      const accessToken = request.cookies['accessToken'];
      if (!accessToken) return true;
      const isVerified = await this.tokenService.verify(accessToken);
      if (!isVerified) return true;
      return false;
    } catch (error) {
      // Verify method from token service is throwing an error when it cannot validate the token.
      return true;
    }
  }
}
