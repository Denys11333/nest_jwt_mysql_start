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
import { UserDevice } from 'src/user-device/entities/user-device.entity';

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
  @OneToMany(() => UserDevice, (userDeivce) => userDeivce.user, {
    cascade: true,
  })
  userDevices: UserDevice[];

  @ApiProperty()
  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
