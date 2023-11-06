import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Author } from '@prisma/client';

@Injectable()
export class AuthorsService {
  constructor(private prismaService: PrismaService) {}
  public getAll(): Promise<Author[]> {
    return this.prismaService.author.findMany();
  }
  public getById(id: Author['id']): Promise<Author | null> {
    return this.prismaService.author.findUnique({
      where: { id },
    });
  }
  public getExtended(): Promise<Author[]> {
    return this.prismaService.author.findMany({ include: { books: true } });
  }
  public getExtendedById(id: Author['id']): Promise<Author | null> {
    return this.prismaService.author.findUnique({
      where: { id },
      include: { books: true },
    });
  }

  public delete(id: Author['id']): Promise<Author> {
    return this.prismaService.author.delete({
      where: { id },
    });
  }
  public create(AuthorData: Omit<Author, 'id'>): Promise<Author> {
    return this.prismaService.author.create({
      data: AuthorData,
    });
  }

  public edit(
    id: Author['id'],
    AuthorData: Omit<Author, 'id'>,
  ): Promise<Author> {
    return this.prismaService.author.update({
      where: { id },
      data: AuthorData,
    });
  }
}
