import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dtos/RegisterDTO.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  public async register(RegisData: RegisterDTO) {
    const hashedPassword = await bcrypt.hash(RegisData.password, 10);
    return this.usersService.create(RegisData.email, hashedPassword);
  }
  public async validateUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    const checkPassword = await bcrypt.compare(
      password,
      user.password.hashedPassword,
    );
    if (user && checkPassword) {
      const { password, ...userWithoutPassword } = user;
      console.log(password);
      return userWithoutPassword;
    }
    return null;
  }
  public async createSession(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    });

    return {
      access_token: accessToken,
    };
  }
}
