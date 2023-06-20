import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const user = await this.authService.getUserByAccessToken(token);
        req.user = user;
      } catch (error) {
        // Handle token validation error, e.g., expired or invalid token
      }
    }

    next();
  }
}
