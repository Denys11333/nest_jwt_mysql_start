export class UserQueryOptions {
  userDevices?: boolean = false;
  roles?: boolean = false;

  constructor(options?: UserQueryOptions) {
    if (options) {
      this.userDevices = options.userDevices;
      this.roles = options.roles;
    }
  }
}
