import {
  Controller,
  Get,
  NotFoundException,
  ParseUUIDPipe,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-users.dto';
import { UpdateUserDTO } from './dtos/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/')
  getAll(): any {
    return this.usersService.getAll();
  }
  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
  }
  @Post('/')
  create(@Body() userData: CreateUserDTO) {
    const { email, hashedPassword } = userData;
    return this.usersService.create(email, hashedPassword);
  }
  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersService.delete(id);
    return { sucess: true };
  }
  @Put('/:id')
  async updateById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() userData: UpdateUserDTO,
  ) {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.usersService.edit(id, userData);
  }
}
