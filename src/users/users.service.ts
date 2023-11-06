import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  public getAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }
  public getById(id: User['id']): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }
  public getByEmail(email: User['email']): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }
  public async create(email: string, hashedPassword: string): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data: {
          email,
          password: {
            create: { hashedPassword },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
    }
  }
}
