import { Test, TestingModule } from '@nestjs/testing';
import { UserSessionCookieController } from './user-session.controller';
import { UserSessionCookieService } from './user-session.service';

describe('UserSessionCookie', () => {
  let controller: UserSessionCookieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSessionCookieController],
      providers: [UserSessionCookieService],
    }).compile();

    controller = module.get<UserSessionCookieController>(
      UserSessionCookieController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
