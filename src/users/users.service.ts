import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Password, User } from '@prisma/client';
import { UpdateUserDTO } from './dtos/update-users.dto';

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
  public async getByEmail(
    email: User['email'],
  ): Promise<(User & { password?: Password }) | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { password: true },
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
  public delete(id: User['id']): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  public async edit(
    userId: string,
    userData: UpdateUserDTO,
    password?: string,
  ): Promise<User> {
    const updateData: any = { ...userData };
    if (password) {
      updateData.password = {
        update: {
          hashedPassword: password,
        },
      };
    }
    return await this.prismaService.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}
