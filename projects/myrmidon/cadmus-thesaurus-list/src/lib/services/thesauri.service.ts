import { Injectable } from '@angular/core';

import { ThesaurusService } from '@myrmidon/cadmus-api';

import { ThesauriStore } from '../state/thesauri.store';

@Injectable({ providedIn: 'root' })
export class ThesauriListService {
  constructor(
    private _store: ThesauriStore,
    private _service: ThesaurusService
  ) {}

  public delete(id: string): Promise<boolean> {
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      this._store.setLoading(true);

      this._service.deleteThesaurus(id).subscribe(
        (_) => {
          this._store.remove(id);
          this._store.setError(null);
          this._store.setLoading(false);
          resolve(true);
        },
        (error) => {
          console.error(error);
          this._store.setLoading(false);
          this._store.setError('Error deleting thesaurus');
          reject(error);
        }
      );
    });
    return promise;
  }
}
