import { PartialType } from '@nestjs/swagger';
import { CreateUserDeviceDto } from './create-user-device.dto';

export class UpdateUserDeviceDto extends PartialType(CreateUserDeviceDto) {}
