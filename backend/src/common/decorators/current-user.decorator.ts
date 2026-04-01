import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../../generated/prisma/client';

export type AuthenticatedUser = User & { role: string };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request as any).currentUser as AuthenticatedUser;
  },
);
