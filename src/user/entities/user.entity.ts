import { UserSession } from 'src/user-session/entities/user-session-cookie.entity';
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
  @OneToMany(() => UserSession, (userSession) => userSession.user, {
    cascade: true,
  })
  userSessions: UserSession[];

  @ApiProperty()
  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
