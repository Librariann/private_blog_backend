import { SetMetadata } from '@nestjs/common';

export const Auth = (...args: string[]) => SetMetadata('auth', args);
