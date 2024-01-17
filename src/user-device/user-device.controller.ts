import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserDeviceService } from './user-device.service';
import { CreateUserDeviceDto } from './dto/create-user-device.dto';
import { UpdateUserDeviceDto } from './dto/update-user-device.dto';

@Controller('user-device')
export class UserDeviceController {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  @Post()
  create(@Body() createUserDeviceDto: CreateUserDeviceDto) {
    return this.userDeviceService.create(createUserDeviceDto);
  }

  @Get()
  findAll() {
    return this.userDeviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userDeviceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDeviceDto: UpdateUserDeviceDto,
  ) {
    return this.userDeviceService.update(+id, updateUserDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDeviceService.remove(+id);
  }
}
