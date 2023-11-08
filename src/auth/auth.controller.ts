import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/RegisterDTO.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  create(@Body() regisData: RegisterDTO) {
    return this.authService.register(regisData);
  }
}
