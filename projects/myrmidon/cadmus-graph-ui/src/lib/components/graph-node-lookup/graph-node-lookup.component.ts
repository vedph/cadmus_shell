import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';

import { GraphService, NodeResult } from '@myrmidon/cadmus-api';

/**
 * Graph node lookup.
 */
@Component({
  selector: 'cadmus-graph-node-lookup',
  templateUrl: './graph-node-lookup.component.html',
  styleUrls: ['./graph-node-lookup.component.css'],
})
export class GraphNodeLookupComponent {
  /**
   * The maximum number of nodes to lookup. Default is 10.
   */
  @Input()
  public limit: number;

  /**
   * True to lookup only class nodes, false to lookup only
   * non-class nodes, undefined or null to lookup any nodes.
   */
  @Input()
  public isClass?: boolean | null;

  /**
   * An optional value for the tag filter. You can use this
   * to lookup only those nodes having a specific tag, e.g.
   * property nodes to be used as predicates.
   */
  @Input()
  public tag?: string;

  /**
   * Emitted whenever a node is picked up.
   */
  @Output()
  public nodeChange: EventEmitter<NodeResult | null>;

  public form: FormGroup;
  public lookup: FormControl;
  public nodes$: Observable<NodeResult[]>;
  public node?: NodeResult;

  constructor(formBuilder: FormBuilder, private _apiService: GraphService) {
    // events
    this.nodeChange = new EventEmitter<NodeResult | null>();
    // form
    this.lookup = formBuilder.control(null);
    this.form = formBuilder.group({
      lookup: this.lookup,
    });
    this.limit = 10;

    this.nodes$ = this.lookup.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: NodeResult | string) => {
        if (typeof value === 'string') {
          return this._apiService
            .getNodes({
              pageNumber: 1,
              pageSize: this.limit || 10,
              label: value,
              isClass:
                this.isClass === undefined || this.isClass === null
                  ? undefined
                  : this.isClass
                  ? true
                  : false,
              tag: this.tag,
            })
            .pipe(map((p) => p.items));
        } else {
          return of([value]);
        }
      })
    );
  }

  public getLookupName(item: NodeResult): string {
    return item?.label;
  }

  public clear(): void {
    this.node = undefined;
    this.lookup.setValue(null);
    this.nodeChange.emit(null);
  }

  public pickItem(item: NodeResult): void {
    this.node = item;
    this.nodeChange.emit(item);
  }
}
