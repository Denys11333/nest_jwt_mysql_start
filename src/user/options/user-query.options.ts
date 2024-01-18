export class UserQueryOptions {
  userSessionsCookie?: boolean = false;
  roles?: boolean = false;

  constructor(options?: UserQueryOptions) {
    if (options) {
      this.userSessionsCookie = options.userSessionsCookie;
      this.roles = options.roles;
    }
  }
}
