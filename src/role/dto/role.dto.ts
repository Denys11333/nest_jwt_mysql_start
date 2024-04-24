import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RoleDto {
  @ApiProperty()
  @Expose()
  roleName: string;

  @ApiProperty()
  @Expose()
  description: string;
}
