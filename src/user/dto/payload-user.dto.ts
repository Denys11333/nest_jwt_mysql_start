import { ApiProperty } from '@nestjs/swagger';

export class PayloadUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  roles: string[];
}
