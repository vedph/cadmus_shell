import { Injectable } from '@angular/core';
import {
  StoreConfig,
  EntityStore,
  EntityState,
  ActiveState,
} from '@datorama/akita';

import { User } from '@myrmidon/cadmus-core';

// https://netbasal.gitbook.io/akita/entity-store/entity-store/active-state
export interface UsersState
  extends EntityState<User, string>,
    ActiveState<string> {
  active: string | null;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users', idKey: 'userName' })
export class UsersStore extends EntityStore<UsersState> {
  constructor() {
    super({});
  }
}
