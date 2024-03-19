import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtModuleOptions } from './jwt.interface';
import { error } from 'console';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}
  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey, {
      expiresIn: '1h',
    });
  }
  verify(token: string) {
    try {
      return jwt.verify(token, this.options.privateKey);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        console.log('Token has expired');
      } else {
        console.log('Invalid token');
      }
    }
  }
}
