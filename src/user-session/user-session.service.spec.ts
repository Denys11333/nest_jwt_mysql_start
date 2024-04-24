import { Test, TestingModule } from '@nestjs/testing';
import { UserSessionCookieService } from './user-session.service';

describe('UserSessionCookie', () => {
  let service: UserSessionCookieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSessionCookieService],
    }).compile();

    service = module.get<UserSessionCookieService>(UserSessionCookieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
