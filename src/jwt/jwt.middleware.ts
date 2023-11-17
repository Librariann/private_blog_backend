import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UserService } from 'src/user/user.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      console.log(token);
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { user } = await this.userService.findById(decoded['id']);
          req['user'] = user;
        }
      } catch (e) {
        console.log(e);
      }
    }
    next();
  }
}
