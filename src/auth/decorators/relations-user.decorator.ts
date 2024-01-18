import { SetMetadata } from '@nestjs/common';
import { UserQueryOptions } from 'src/user/options/user-query.options';

export const RELATIONS_KEY = 'relations';

export const UserRelations = (queryOptions?: UserQueryOptions) =>
  SetMetadata(RELATIONS_KEY, queryOptions);
