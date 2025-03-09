import { IsOptional, IsString, IsEmail, IsPhoneNumber, IsEnum, IsDateString } from 'class-validator';
import { Role } from 'src/enum/Role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;
}
