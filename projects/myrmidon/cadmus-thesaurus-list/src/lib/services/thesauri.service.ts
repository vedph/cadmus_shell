import { Injectable } from '@angular/core';
import { ThesauriStore } from '../state/thesauri.store';
import { ItemService } from '@myrmidon/cadmus-api';

@Injectable({ providedIn: 'root' })
export class ThesauriListService {
  constructor(private _store: ThesauriStore, private _service: ItemService) {}

  public delete(id: string): Promise<boolean> {
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      this._store.setLoading(true);

      this._service.deleteItem(id).subscribe(
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
