import { UserSessionCookie } from 'src/user-session-cookie/entities/user-session-cookie.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @OneToMany(
    () => UserSessionCookie,
    (userSessionCookie) => userSessionCookie.user,
    {
      cascade: true,
    },
  )
  userSessionsCookie: UserSessionCookie[];

  @ApiProperty()
  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
