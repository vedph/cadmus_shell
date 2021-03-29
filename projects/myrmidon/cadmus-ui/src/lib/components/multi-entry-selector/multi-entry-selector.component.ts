import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * A multiple entries selector.
 */
@Component({
  selector: 'cadmus-multi-entry-selector',
  templateUrl: './multi-entry-selector.component.html',
  styleUrls: ['./multi-entry-selector.component.css'],
})
export class MultiEntrySelectorComponent implements OnInit, OnDestroy {
  private _ids: string[] | undefined;
  private _entries: ThesaurusEntry[] | undefined;
  private _data$: BehaviorSubject<{
    selectedIds: string[];
    entries: ThesaurusEntry[];
  }>;
  private _subs: Subscription[];
  private _changeFrozen: boolean;

  /**
   * The IDs of the selected entries.
   */
  @Input()
  public get selectedIds(): string[] | undefined {
    return this._ids;
  }
  public set selectedIds(value: string[] | undefined) {
    this._ids = value;
    this._data$.next({
      selectedIds: value,
      entries: this._entries,
    });
  }

  /**
   * All the available entries.
   */
  @Input()
  public get entries(): ThesaurusEntry[] | undefined {
    return this._entries;
  }
  public set entries(value: ThesaurusEntry[] | undefined) {
    this._entries = value;
    this._data$.next({
      selectedIds: this._ids,
      entries: value,
    });
  }

  /**
   * True to show the ordinal number next to each entry.
   */
  @Input()
  public numbering = false;

  /**
   * True to show a toolbar above the entries.
   */
  @Input()
  public toolbar = true;

  /**
   * Emitted whenever selected IDs change.
   */
  @Output()
  public selectionChange: EventEmitter<string[]>;

  public entriesArr: FormArray;
  public form: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._data$ = new BehaviorSubject<{
      selectedIds: string[];
      entries: ThesaurusEntry[];
    }>({ selectedIds: [], entries: [] });
    this.selectionChange = new EventEmitter<string[]>();
    this._subs = [];
    // form
    this.entriesArr = _formBuilder.array([]);
    this.form = _formBuilder.group({
      entriesArr: this.entriesArr,
    });
  }

  ngOnInit(): void {
    this._data$.subscribe((_) => {
      this.updateForm();
    });
  }

  ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
  }

  private getEntryGroup(selected: boolean): FormGroup {
    const g = this._formBuilder.group({
      entry: this._formBuilder.control(selected),
    });
    this._subs.push(
      g.valueChanges
        .pipe(distinctUntilChanged(), debounceTime(200))
        .subscribe((_) => {
          if (!this._changeFrozen) {
            this.selectionChange.emit(this.getSelectedIds());
          }
        })
    );
    return g;
  }

  private updateForm(): void {
    this.entriesArr.clear();
    if (this._entries?.length) {
      this._entries.forEach((entry) => {
        this.entriesArr.controls.push(
          this.getEntryGroup(this._ids?.includes(entry.id))
        );
      });
    }
  }

  private getSelectedIds(): string[] {
    const selectedIds: string[] = [];
    for (let i = 0; i < this.entriesArr.controls.length; i++) {
      const g = this.entriesArr.at(i) as FormGroup;
      if (g.controls.entry.value) {
        selectedIds.push(this._entries[i].id);
      }
    }
    return selectedIds;
  }

  public toggleAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.entriesArr.controls.length; i++) {
      const g = this.entriesArr.at(i) as FormGroup;
      g.controls.entry.setValue(!g.controls.entry.value);
    }
    this._changeFrozen = false;
    this.selectionChange.emit(this.getSelectedIds());
  }

  public deselectAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.entriesArr.controls.length; i++) {
      const g = this.entriesArr.at(i) as FormGroup;
      g.controls.entry.setValue(false);
    }
    this._changeFrozen = false;
    this.selectionChange.emit(this.getSelectedIds());
  }

  public selectAll(): void {
    this._changeFrozen = true;
    for (let i = 0; i < this.entriesArr.controls.length; i++) {
      const g = this.entriesArr.at(i) as FormGroup;
      g.controls.entry.setValue(true);
    }
    this._changeFrozen = false;
    this.selectionChange.emit(this.getSelectedIds());
  }
}
