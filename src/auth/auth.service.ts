import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
//import { User } from '@prisma/client';
import { RegisterDTO } from './dtos/RegisterDTO.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  public async register(RegisData: RegisterDTO) {
    const hashedPassword = await bcrypt.hash(RegisData.password, 10);
    return this.usersService.create(RegisData.email, hashedPassword);
  }
}
