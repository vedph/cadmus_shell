import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ThesaurusFilter } from '@myrmidon/cadmus-core';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
} from 'rxjs/operators';

/**
 * Thesaurus ID lookup component.
 */
@Component({
  selector: 'cadmus-thesaurus-lookup',
  templateUrl: './thesaurus-lookup.component.html',
  styleUrls: ['./thesaurus-lookup.component.css'],
})
export class ThesaurusLookupComponent implements OnInit {
  private _initialValue: string | undefined;

  /**
   * The entry value initially set when the component loads.
   */
  @Input()
  public get initialValue(): string | undefined {
    return this._initialValue;
  }
  public set initialValue(value: string | undefined) {
    this._initialValue = value;
    if (this.lookup) {
      this.resetToInitial();
    }
  }

  /**
   * The label to be displayed for this lookup.
   */
  @Input()
  public label: string;

  /**
   * The maximum count of lookup entries to retrieve.
   * Default is 10.
   */
  @Input()
  public limit: number;

  /**
   * True to reset the lookup value after it is picked.
   * This is typically used when you use this component
   * as a pure lookup device, storing the picked value
   * elsewhere when handling its entryChange event.
   */
  @Input()
  public resetOnPick: boolean | undefined;

  /**
   * The lookup function used to lookup thesauri.
   */
  @Input()
  public lookupFn: (filter?: ThesaurusFilter) => Observable<string[]>;

  @Output()
  public entryChange: EventEmitter<string | null>;

  public form: FormGroup;
  public lookup: FormControl;
  public ids$: Observable<string[]> | undefined;
  public id: string | undefined;

  constructor(formBuilder: FormBuilder) {
    this.label = 'thesaurus';
    // events
    this.entryChange = new EventEmitter<string | null>();
    // form
    this.lookup = formBuilder.control(null);
    this.form = formBuilder.group({
      lookup: this.lookup,
    });
    this.limit = 10;
  }

  private lookupEntries(filter: string, limit: number): Observable<string[]> {
    if (!filter || !this.lookupFn) {
      return of([]);
    }
    return this.lookupFn({
      pageNumber: 1,
      pageSize: limit,
      id: filter,
    });
  }

  private resetToInitial(): void {
    this.lookupEntries(this._initialValue || '', 1)
      .pipe(take(1))
      .subscribe((entries) => {
        this.lookup.setValue(entries.length ? entries[0] : undefined);
      });
  }

  ngOnInit(): void {
    this.ids$ = this.lookup.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: string | string) => {
        // if it's a string it's a filter; else it's the entry got
        if (typeof value === 'string') {
          return this.lookupEntries(value, this.limit || 10);
        } else {
          return of([value]);
        }
      })
    );
    // setup initial value if its name was specified
    if (this._initialValue) {
      this.resetToInitial();
    }
  }

  public clear(): void {
    this.id = undefined;
    this.lookup.setValue(null);
    this.entryChange.emit(null);
  }

  public pickId(id: string): void {
    this.id = id;
    this.entryChange.emit(id);
  }
}
