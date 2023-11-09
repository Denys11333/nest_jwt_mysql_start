import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserCredentialDto } from './user-credential.dto';

export class UpdateUserDto extends PartialType(UserCredentialDto) {
  @ApiProperty()
  roles: string[];
}
