import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @MinLength(6)
  @MaxLength(32)
  password: string;

  @IsEmail()
  email: string;
}
