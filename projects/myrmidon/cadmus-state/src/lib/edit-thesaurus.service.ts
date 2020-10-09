import { Injectable } from '@angular/core';
import { EditThesaurusStore } from './edit-thesaurus.store';
import { ThesaurusService } from '@myrmidon/cadmus-api';
import { Thesaurus } from '@myrmidon/cadmus-core';

@Injectable({ providedIn: 'root' })
export class EditThesaurusService {
  constructor(
    private _store: EditThesaurusStore,
    private _thesaurusService: ThesaurusService
  ) {}

  public load(id: string | null): void {
    this._store.setLoading(true);

    if (id) {
      this._thesaurusService.getThesaurus(id, true).subscribe(
        (thesaurus) => {
          this._store.setLoading(false);
          this._store.update({
            thesaurus,
          });
        },
        (error) => {
          console.error(error);
          this._store.setLoading(false);
          this._store.setError('Error loading thesaurus ' + id);
        }
      );
    } else {
      this._store.update({
        thesaurus: {
          id: null,
          language: 'en',
          entries: [],
        },
      });
    }
  }

  public reset(): void {
    this._store.reset();
  }

  public save(thesaurus: Thesaurus): Promise<Thesaurus> {
    this._store.setSaving(true);

    return new Promise((resolve, reject) => {
      this._thesaurusService.addThesaurus(thesaurus).subscribe(
        (saved) => {
          this._store.setSaving(false);
          this.load(this._store.getValue().thesaurus.id);
          resolve(saved);
        },
        (error) => {
          console.error(error);
          this._store.setSaving(false);
          this._store.setError('Error saving thesaurus');
          reject(error);
        }
      );
    });
  }
}
