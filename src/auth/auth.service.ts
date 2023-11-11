import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dtos/RegisterDTO.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  public async register(RegisData: RegisterDTO) {
    const hashedPassword = await bcrypt.hash(RegisData.password, 10);
    return this.usersService.create(RegisData.email, hashedPassword);
  }
  public async validateUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    //const passportRecord = await this.usersService.get
    if (
      user &&
      (await bcrypt.compare(password, user.password.hashedPassword))
    ) {
      const { password, ...userWithoutPassword } = user;
      console.log(password);
      return userWithoutPassword;
    }
    return null;
  }
  public async createSession(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: 'xrwe4543534',
      expiresIn: '12h',
    });

    return {
      access_token: accessToken,
    };
  }
}
