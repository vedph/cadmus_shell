import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { NodeResult, TripleFilter } from '@myrmidon/cadmus-api';

import { GraphTriplesQuery } from '../../state/graph-triples.query';
import { GraphTriplesService } from '../../state/graph-triples.service';

/**
 * Graph triples filter used in graph triples list.
 * Its data are in the graph triples store, which gets updated when
 * users apply new filters.
 */
@Component({
  selector: 'cadmus-graph-triple-filter',
  templateUrl: './graph-triple-filter.component.html',
  styleUrls: ['./graph-triple-filter.component.css'],
})
export class GraphTripleFilterComponent implements OnInit {
  public filter$: Observable<TripleFilter>;
  public subject$: Observable<NodeResult | undefined>;
  public predicate$: Observable<NodeResult | undefined>;
  public object$: Observable<NodeResult | undefined>;
  public literal: FormControl;
  public objectLit: FormControl;
  public sid: FormControl;
  public sidPrefix: FormControl;
  public tag: FormControl;
  public form: FormGroup;

  @Input()
  public disabled?: boolean;

  constructor(
    formBuilder: FormBuilder,
    private _triplesQuery: GraphTriplesQuery,
    private _triplesService: GraphTriplesService
  ) {
    this.filter$ = _triplesQuery.selectFilter();
    this.subject$ = _triplesQuery.selectTerm('S');
    this.predicate$ = _triplesQuery.selectTerm('P');
    this.object$ = _triplesQuery.selectTerm('O');
    // form
    this.literal = formBuilder.control(false);
    this.objectLit = formBuilder.control(null, Validators.maxLength(100));
    this.sid = formBuilder.control(null);
    this.sidPrefix = formBuilder.control(false);
    this.tag = formBuilder.control(null);
    this.form = formBuilder.group({
      literal: this.literal,
      objectLit: this.objectLit,
      sid: this.sid,
      sidPrefix: this.sidPrefix,
      tag: this.tag,
    });
  }

  ngOnInit(): void {
    this.filter$.subscribe((f) => {
      this.updateForm(f);
    });
  }

  private updateForm(filter: TripleFilter): void {
    this._triplesService.setTermId(filter.subjectId, 'S');
    this._triplesService.setTermId(filter.predicateId, 'P');
    this._triplesService.setTermId(filter.objectId, 'O');
    this.literal.setValue(filter.objectLiteral ? true : false);
    this.objectLit.setValue(filter.objectLiteral);
    this.sid.setValue(filter.sid);
    this.tag.setValue(filter.tag);
    this.form.markAsPristine();
  }

  private getFilter(): TripleFilter {
    return {
      pageNumber: 1, // not used
      pageSize: 20, // not used
      subjectId: this._triplesQuery.getTerm('S')?.id,
      predicateId: this._triplesQuery.getTerm('P')?.id,
      objectId: this.literal.value
        ? undefined
        : this._triplesQuery.getTerm('O')?.id,
      objectLiteral: this.literal.value
        ? this.objectLit.value?.trim()
        : undefined,
      sid: this.sid.value?.trim(),
      tag: this.tag.value?.trim(),
    };
  }

  public reset(): void {
    this.form.reset();
    this.apply();
  }

  public apply(): void {
    if (this.form.invalid) {
      return;
    }
    const filter = this.getFilter();

    // update filter in state
    this._triplesService.updateFilter(filter);
  }
}
