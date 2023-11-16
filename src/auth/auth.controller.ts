import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/RegisterDTO.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  create(@Body() regisData: RegisterDTO) {
    return this.authService.register(regisData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    const tokens = await this.authService.createSession(req.user);
    res.cookie('auth', tokens, { httpOnly: true });
    return res.send({
      message: 'success',
    });
  }
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('auth', { httpOnly: true });
    return res.send({ message: 'Logged out successfully' });
  }
}
