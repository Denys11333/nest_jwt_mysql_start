import { CreateUserDeviceDto } from './../user-device/dto/create-user-device.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserDeviceService } from 'src/user-device/user-device.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private roleService: RoleService,
    private userDeviceService: UserDeviceService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    createUserDeviceDto: CreateUserDeviceDto,
  ) {
    let role = await this.roleService.getRoleByValue('USER');

    if (!role) {
      const createdRole: CreateRoleDto = {
        roleName: 'USER',
        description: 'simple role',
      };

      role = await this.roleService.createRole(createdRole);
    }

    const userDevice = await this.userDeviceService.create(createUserDeviceDto);

    return await this.userRepository.save({
      ...createUserDto,
      roles: [role],
      userDevices: [userDevice],
    });
  }

  async findUserByUsername(username: string) {
    return await this.userRepository.findOne({
      where: { username: username },
      relations: {
        roles: true,
        userDevices: true,
      },
    });
  }

  async addUserDeviceIfNotExist(
    user: User,
    createUserDeviceDto: CreateUserDeviceDto,
  ) {
    const detectedDevice = await user.userDevices.find(
      (userDevice) =>
        userDevice.operationSystem === createUserDeviceDto.operationSystem &&
        userDevice.ipAddress === createUserDeviceDto.ipAddress,
    );

    if (!detectedDevice) {
      return await this.userDeviceService.create(createUserDeviceDto);
    }

    return detectedDevice;
  }
}
