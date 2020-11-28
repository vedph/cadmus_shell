import { Part, ThesauriSet } from '@myrmidon/cadmus-core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';
import { EditPartState } from './edit-part.store';

/**
 * Base class for implementing editor part queries.
 * To implement an editor part query, just extend this passing the specialized
 * part's store to the constructor.
 */
export abstract class EditPartQueryBase extends Query<EditPartState> {
  constructor(protected store: any) {
    super(store);
  }

  public selectDirty(): Observable<boolean> {
    return this.select((state) => state.dirty);
  }

  public selectSaving(): Observable<boolean> {
    return this.select((state) => state.saving);
  }

  public selectPart(): Observable<Part> {
    return this.select((state) => state.part);
  }

  public selectThesauri(): Observable<ThesauriSet> {
    return this.select((state) => state.thesauri);
  }
}
