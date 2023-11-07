import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @Length(10, 30)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 30)
  hashedPassword: string;
}
