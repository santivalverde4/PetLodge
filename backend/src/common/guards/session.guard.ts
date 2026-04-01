import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { auth } from '../../auth/auth.config';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const session = await auth.api.getSession({
      headers: new Headers(request.headers as Record<string, string>),
    });

    if (!session?.user?.id) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    // role comes from neon_auth.user.role (single source of truth)
    const sessionUser = session.user as Record<string, unknown>;
    (request as any).currentUser = {
      ...user,
      role: (sessionUser['role'] as string) ?? 'user',
    };

    return true;
  }
}
