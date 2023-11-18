import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book, UserOnBooks } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}
  public getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({ include: { author: true } });
  }
  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }
  public create(
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    try {
      return this.prismaService.book.create({
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new BadRequestException('Book does not exist');
    }
  }
  public delete(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }
  public edit(
    id: Book['id'],
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    return this.prismaService.book.update({
      where: { id },
      data: {
        ...otherData,
        author: { connect: { id: authorId } },
      },
    });
  }
  public async likedBook(
    likedBookData: Omit<UserOnBooks, 'id'>,
  ): Promise<Book> {
    const { bookId, userId } = likedBookData;

    return await this.prismaService.book.update({
      where: { id: bookId },
      data: {
        users: {
          create: {
            user: {
              connect: { id: userId },
            },
          },
        },
      },
    });
  }
}
