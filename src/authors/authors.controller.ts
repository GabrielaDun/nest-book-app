import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';

import { CreateAuthorsDTO } from './dtos/create-author.dts';
import { ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { UpdateAuthorsDTO } from './dtos/update-authors.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Get('/')
  getAll(): any {
    return this.authorsService.getAll();
  }
  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const prod = await this.authorsService.getById(id);
    if (!prod) throw new NotFoundException('Author not found');
    return prod;
  }
  @Get('/extended')
  getExtended(): any {
    return this.authorsService.getExtended();
  }
  @Get('/extended/:id')
  async getExtendedById(@Param('id', new ParseUUIDPipe()) id: string) {
    const prod = await this.authorsService.getById(id);
    if (!prod) throw new NotFoundException('Author not found');
    return prod;
  }

  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const prod = await this.authorsService.getById(id);
    if (!prod) throw new NotFoundException('Author not found');
    await this.authorsService.delete(id);
    return { sucess: true };
  }
  @Post('/')
  create(@Body() authorData: CreateAuthorsDTO) {
    console.log(authorData);
    return this.authorsService.create(authorData);
  }
  @Put('/:id')
  async edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() authorData: UpdateAuthorsDTO,
  ) {
    if (!(await this.authorsService.getById(id)))
      throw new NotFoundException('Author not found');
    await this.authorsService.edit(id, authorData);
    return { sucess: true };
  }
}
