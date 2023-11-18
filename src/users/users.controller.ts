import {
  Controller,
  Get,
  NotFoundException,
  ParseUUIDPipe,
  Param,
  Body,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-users.dto';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
  @Delete('/:id')
  @UseGuards(AdminAuthGuard)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    else {
      await this.usersService.delete(id);
      return { sucess: true };
    }
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
