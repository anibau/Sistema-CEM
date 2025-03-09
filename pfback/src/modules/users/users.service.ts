import { Injectable } from '@nestjs/common';

import { User } from './User.entity';

import { UsersRepository } from './users.repository';
import { Role } from 'src/enum/Role.enum';
import { UpdateUserDto } from 'src/dto/users/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll() {
    return await this.usersRepository.findAll();
  }

  async findByRole(id: string, role: Role) {
    return await this.usersRepository.findByRole(id, role);
  }

  async changeRole(role: Partial<User>, id: string) {
    return await this.usersRepository.changeRole(role, id);
  }

  async changePassword(id: string, password: Partial<User>) {
    return await this.usersRepository.changePassword(id, password);
  }

  async updateUser(id: string, user: UpdateUserDto) {
    return await this.usersRepository.updateUser(id, user);
  }
}
