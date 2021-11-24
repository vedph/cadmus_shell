import { Injectable } from '@angular/core';

import { GraphService, NodeResult, TripleFilter } from '@myrmidon/cadmus-api';
import { take } from 'rxjs/operators';

import { GraphTriplesStore } from './graph-Triples.store';

@Injectable({ providedIn: 'root' })
export class GraphTriplesService {
  constructor(
    private _graphService: GraphService,
    private _store: GraphTriplesStore
  ) {}

  /**
   * Update the filter in the store.
   * @param filter The filter.
   */
  public updateFilter(filter: TripleFilter): void {
    this._store.update({
      filter: filter,
    });
  }

  /**
   * Set the node term used in filter.
   *
   * @param node The node or null/undefined.
   * @param type The type: subject, predicate, object.
   */
  public setTerm(
    node: NodeResult | null | undefined,
    type: 'S' | 'P' | 'O'
  ): void {
    switch (type) {
      case 'S':
        this._store.update({
          subjectNode: node ? node : undefined,
        });
        break;
      case 'P':
        this._store.update({
          predicateNode: node ? node : undefined,
        });
        break;
      case 'O':
        this._store.update({
          objectNode: node ? node : undefined,
        });
        break;
    }
  }

  /**
   * Set the node term used in filter by its ID.
   *
   * @param id The node ID or null/undefined.
   * @param type The type: subject, predicate, object.
   */
  public setTermId(id: number | null | undefined, type: 'S' | 'P' | 'O'): void {
    if (!id) {
      this.setTerm(null, type);
      return;
    }
    this._graphService
      .getNode(id)
      .pipe(take(1))
      .subscribe(
        (node) => {
          this.setTerm(node, type);
        },
        (error) => {
          if (error) {
            console.error(JSON.stringify(error));
          }
          console.warn('Node ID not found: ' + id);
        }
      );
  }
}
