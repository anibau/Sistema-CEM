import { Role } from 'src/enum/Role.enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...args: Role[]) => SetMetadata('roles', args);
