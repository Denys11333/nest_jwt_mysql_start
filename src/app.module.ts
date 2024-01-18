import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './database.config';
import { UserModule } from './user/user.module';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { UserSessionCookieModule } from './user-session-cookie/user-session-cookie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    RoleModule,
    MyLoggerModule,
    UserSessionCookieModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
