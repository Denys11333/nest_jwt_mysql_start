import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserSessionDto {
  @ApiProperty()
  @Expose()
  operationSystem: string;

  @ApiProperty()
  @Expose()
  ipAddress: string;

  @ApiProperty()
  @Expose()
  deletedAt: string;
}
