import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserQueryOptions } from './options/user-query.options';
import { UserSessionCookieService } from 'src/user-session-cookie/user-session-cookie.service';
import { CreateUserSessionCookieDto } from 'src/user-session-cookie/dto/create-user-session-cookie.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private roleService: RoleService,
    private userSessionCookieService: UserSessionCookieService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    let role = await this.roleService.getRoleByValue('USER');

    if (!role) {
      const createdRole: CreateRoleDto = {
        roleName: 'USER',
        description: 'simple role',
      };

      role = await this.roleService.createRole(createdRole);
    }

    return await this.userRepository.save({
      ...createUserDto,
      roles: [role],
    });
  }

  async findUserByUsername(username: string, queryOptions?: UserQueryOptions) {
    return await this.userRepository.findOne({
      where: { username: username },
      relations: queryOptions,
    });
  }

  async createUserSessionCookie(
    createUserSessionCookie: CreateUserSessionCookieDto,
  ) {
    return await this.userSessionCookieService.create(createUserSessionCookie);
  }
}
