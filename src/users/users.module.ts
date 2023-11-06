import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/shared/services/prisma.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController, PrismaService],
})
export class UsersModule {}
