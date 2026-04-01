import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SessionGuard } from './common/guards/session.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Order matters: SessionGuard runs first (validates token + attaches user),
    // then RolesGuard checks the role on the attached user.
    { provide: APP_GUARD, useClass: SessionGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
