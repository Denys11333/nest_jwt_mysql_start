import { Injectable } from '@nestjs/common';
import { CreateUserDeviceDto } from './dto/create-user-device.dto';
import { UpdateUserDeviceDto } from './dto/update-user-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDevice } from './entities/user-device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserDeviceService {
  constructor(
    @InjectRepository(UserDevice)
    private userDeviceRepository: Repository<UserDevice>,
  ) {}

  create(createUserDeviceDto: CreateUserDeviceDto) {
    return this.userDeviceRepository.save(createUserDeviceDto);
  }

  setRefreshToken(userDevice: UserDevice, refreshToken: string) {
    return this.userDeviceRepository.save({ ...userDevice, refreshToken });
  }

  findAll() {
    return `This action returns all userDevice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userDevice`;
  }

  update(id: number, updateUserDeviceDto: UpdateUserDeviceDto) {
    return `This action updates a #${id} userDevice`;
  }

  remove(id: number) {
    return `This action removes a #${id} userDevice`;
  }
}
