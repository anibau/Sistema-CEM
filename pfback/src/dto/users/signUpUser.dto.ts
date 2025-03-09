import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,

  Max,
  Min,

  MinLength,
} from 'class-validator';

export class SignUpUserDto {
  @MinLength(3, { message: 'El nombre debe ser de minimo 3 caracteres' })
  @IsString()
  name: string;

  @IsNotEmpty({
    message: 'Por favor ingresa el Correo Electrónico',
  })
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'El campo Contraseña es Obligatorio' })
  @MinLength(10, { message: 'La contraseña debe ser de minimo 10 caracteres' })
  @IsString()
  password: string;

  @IsNotEmpty({ message: 'Por favor ingresa un telefono alternativo' })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: 'El campo DNI es Obligatorio' })
  @IsString()
  dni: string;
}

