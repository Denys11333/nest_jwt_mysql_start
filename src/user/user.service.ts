import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async createUser(userCredential: CreateUserDto) {
    let role = await this.roleService.getRoleByValue('USER');

    if (!role) {
      const createdRole: CreateRoleDto = {
        roleName: 'USER',
        description: 'simple role',
      };

      role = await this.roleService.createRole(createdRole);
    }

    return await this.userRepository.save({ ...userCredential, roles: [role] });
  }

  async findUserForAuth(username: string) {
    return await this.userRepository.findOne({
      where: { username: username },
      relations: {
        roles: true,
      },
    });
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    user.refreshToken = refreshToken;

    return this.userRepository.save(user);
  }
}
