import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty({ message: 'El campo Correo Electronico es Obligatorio' })
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'El campo Contraseña es Obligatorio' })
  @MinLength(10, { message: 'La contraseña debe ser de minimo 10 caracteres' })
  password: string;
}
