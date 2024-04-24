import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { RoleDto } from 'src/role/dto/role.dto';
import { UserSessionDto } from 'src/user-session/dto/user-session.dto';

@Exclude()
export class UserDto {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  @Type(() => RoleDto)
  roles: RoleDto[];

  @ApiProperty()
  @Expose()
  @Type(() => UserSessionDto)
  userSessions: UserSessionDto[];
}
