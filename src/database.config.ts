import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { UserSession } from './user-session/entities/user-session-cookie.entity';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      database: this.configService.get('MYSQL_DB'),
      host: this.configService.get('MYSQL_HOST'),
      password: this.configService.get('MYSQL_PASSWORD'),
      port: Number(this.configService.get('MYSQL_PORT')),
      username: this.configService.get('MYSQL_USER'),
      entities: [User, Role, UserSession],
      synchronize: true,
    };
  }
}
