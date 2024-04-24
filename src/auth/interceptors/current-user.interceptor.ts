import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { RELATIONS_KEY } from '../decorators/user-relations.decorator';
import { UserQueryOptions } from 'src/user/options/user-query.options';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private readonly userService: UserService,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const relations = this.reflector.getAllAndOverride<UserQueryOptions>(
      RELATIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    try {
      const user = await this.userService.findUserByUsername(
        request.user.username,
        relations,
      );
      request.currentUser = user;
    } catch (error) {
      console.log('Error', error);
      throw new BadRequestException();
    }
    return handler.handle();
  }
}
