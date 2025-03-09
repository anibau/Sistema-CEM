import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from 'src/dto/users/signUpUser.dto';
import { User } from '../users/User.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Role } from 'src/enum/Role.enum';
import * as bcrypt from 'bcrypt';
import { SignInUserDto } from 'src/dto/users/signInUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async signUp(registerCreds: SignUpUserDto): Promise<Object> {
    console.log(registerCreds);

    const userInstance = plainToInstance(SignUpUserDto, registerCreds);
    const errors = await validate(userInstance);

    if (errors.length > 0) {
      const errorsMessage = errors.map((err) => {
        return Object.values(err.constraints || {}).join(', ');
      });
      throw new BadRequestException(errorsMessage.join('; '));
    }

    const alreadyExist = await this.user.findOne({
      where: { email: registerCreds.email },
    });

    if (alreadyExist) {
      throw new BadRequestException(
        'El Correo Electrónico ya esta en uso. Ingresa uno diferente',
      );
    }

    const alreadyExistDni = await this.user.findOne({
      where: { dni: registerCreds.dni },
    });

    if (alreadyExistDni) {
      throw new BadRequestException('El DNI ya existe. Ingresa uno nuevo');
    }

    const hashedPassword = await bcrypt.hash(registerCreds.password, 10);

    const newUser = this.user.create({
      ...registerCreds,
      password: hashedPassword,
    });

    await this.user.save(newUser);

    return {
      success: 'Registro Completado con exito',
      newUser,
    };
  }

  async signIn(loginCreds: SignInUserDto): Promise<Object> {
    console.log(loginCreds);

    const credentialsInstance = plainToInstance(SignInUserDto, loginCreds);

    const errors = await validate(credentialsInstance);

    if (errors.length > 0) {
      const errorsMessage = errors.map((err) => {
        return Object.values(err.constraints || {}).join(',');
      });
      throw new BadRequestException(errorsMessage.join(';'));
    }

    const userFound = await this.user.findOne({
      where: { email: loginCreds.email },
      relations: { adminOrders: {payments: true} },
    });
   
      













    if (!userFound) {
      throw new BadRequestException('El usuario no existe');
    }

    const validPassword = await bcrypt.compare(
      loginCreds.password,
      userFound.password,
    );

    if (!validPassword) {
      throw new BadRequestException('Credenciales Invalidas');
    }

    const token = this.jwt.sign({
      id: userFound.id,
      email: userFound.email,
      role: userFound.role,
    });

    return {
      login: true,
      token,
      userFound,
    };
  }
}
