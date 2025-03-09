import { InjectRepository } from '@nestjs/typeorm';
import { User } from './User.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/enum/Role.enum';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/dto/users/updateUser.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  /*async findByRole(id: string, role: Role): Promise<User> {
    const userFound = await this.usersRepository.findOne({
      where: { id, role },
    });

    if (!userFound) {
      throw new NotFoundException('User Not Exist');
    }

    return userFound;
  }*/

  /**********/

  async findByRole (name: string, role: Role): Promise<User> {

    const userFound = await this.usersRepository.findOne ({

      where: { name, role }, 

    });
  
    if (!userFound) {

      throw new NotFoundException (`El usuario con el nombre "${name}" y el rol "${role}" no fue encontrado.`);

    }
  
    return userFound;
    
  }
    
  /**********/

  async changeRole(role: Partial<User>, id: string): Promise<Object> {
    console.log(typeof role.role);

    const userFound = await this.usersRepository.findOne({ where: { id } });

    if (!userFound) {
      throw new NotFoundException('El usuario no existe');
    }

    if (!Role[role.role]) {
      throw new BadRequestException(
        `El rol ${role.role} no es válido. Solo es posible:${Object.values(Role).join(',')}`,
      );
    }

    if (Role[role.role] === userFound.role) {
      throw new BadRequestException('El usuario ya tiene ese rol.');
    }

    await this.usersRepository.update(id, { role: role.role });

    return {
      success: true,
      message: 'Rol cambiado correctamente',
    };
  }

  async changePassword(id: string, password: Partial<User>): Promise<Object> {
    try {
      const user = await this.usersRepository.findOneOrFail({ where: { id } });

      const hashedPassword = await bcrypt.hash(password.password, 10);

      await this.usersRepository.update(id, { password: hashedPassword });

      return {
        success: true,
        message: 'Contraseña Cambiada',
        user,
      };
    } catch (error) {
      throw new NotFoundException('El usuario no existe');
    }
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<Object> {
    try {
      await this.usersRepository.update(id, user);
      return {
        success: true,
        message: 'Usuario actualizado con éxito',
      };
    } catch (error) {
      // Manejo de error
      console.error('Error al actualizar usuario:', error);
      throw new NotFoundException('El usuario no existe');
    }
  }
  
}
