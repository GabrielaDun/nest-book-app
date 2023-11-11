import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create-books.dto';
import { UpdateBookDTO } from './dtos/update-books.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Get('/')
  getAll(): any {
    return this.booksService.getAll();
  }
  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }
  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() bookData: CreateBookDTO) {
    return this.booksService.create(bookData);
  }
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found');
    await this.booksService.delete(id);
    return { sucess: true };
  }
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Book not found');
    await this.booksService.edit(id, bookData);
    return { sucess: true };
  }
}
