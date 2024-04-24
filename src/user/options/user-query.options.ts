export class UserQueryOptions {
  userSessions?: boolean = false;
  roles?: boolean = false;

  constructor(options?: UserQueryOptions) {
    if (options) {
      this.userSessions = options.userSessions;
      this.roles = options.roles;
    }
  }
}
