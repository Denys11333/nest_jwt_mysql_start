import { ApiProperty } from '@nestjs/swagger';

export class PayloadUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  roles: string[];
}
