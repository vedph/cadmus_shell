import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

import { TextTile, TEXT_TILE_TEXT_DATA_NAME } from '../tiled-text-part';

@Component({
  selector: 'cadmus-text-tile',
  templateUrl: './text-tile.component.html',
  styleUrls: ['./text-tile.component.css'],
})
export class TextTileComponent implements OnInit {
  private _tile?: TextTile;
  private _checkedChangeFrozen?: boolean;

  @ViewChild('textInput')
  public textElement?: ElementRef;

  @Input()
  public selected?: boolean;

  @Input()
  public checkable?: boolean;

  @Input()
  public readonly?: boolean;

  @Input()
  public color?: string;

  @Input()
  public get checked(): boolean {
    return this.checker.value;
  }
  public set checked(value: boolean) {
    if (this.checker.value === value) {
      return;
    }
    this._checkedChangeFrozen = true;
    this.checker.setValue(value);
    this._checkedChangeFrozen = false;
  }

  @Input()
  public get tile(): TextTile | undefined {
    return this._tile;
  }
  public set tile(value: TextTile | undefined) {
    if (this._tile === value) {
      return;
    }
    this._tile = value;
    this.updateForm();
  }
  @Output()
  public tileChange: EventEmitter<TextTile>;
  @Output()
  public editData: EventEmitter<TextTile>;
  @Output()
  public checkedChange: EventEmitter<{ checked: boolean; tile: TextTile }>;

  public form: FormGroup;
  public editedText: FormControl;
  public text?: string;
  public editing?: boolean;
  public checker: FormControl;

  constructor(formBuilder: FormBuilder) {
    // form
    this.editedText = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[^\s]+$/),
    ]);
    this.form = formBuilder.group({
      editedText: this.editedText,
    });

    this.checker = formBuilder.control(false);

    // events
    this.tileChange = new EventEmitter<TextTile>();
    this.editData = new EventEmitter<TextTile>();
    this.checkedChange = new EventEmitter<{
      checked: boolean;
      tile: TextTile;
    }>();
  }

  ngOnInit(): void {
    this.checker.valueChanges.pipe(distinctUntilChanged()).subscribe((_) => {
      if (this._checkedChangeFrozen || !this.checkable) {
        return;
      }
      if (this.tile) {
        this.checkedChange.emit({
          checked: this.checker.value,
          tile: this.tile,
        });
      }
    });
  }

  private updateForm(): void {
    if (!this._tile) {
      this.form.reset();
      this.text = undefined;
    } else {
      this.text = this._tile.data
        ? this._tile.data[TEXT_TILE_TEXT_DATA_NAME]
        : undefined;
      this.editedText.setValue(this.text);
      this.form.markAsPristine();
    }
  }

  public requestDataEdit(): void {
    if (!this.readonly) {
      this.editData.emit(this.tile);
    }
  }

  public toggleCheckedNonEdit(): void {
    if (!this.editing && this.checkable) {
      this.checked = !this.checked;
    }
  }

  public edit(): void {
    if (this.editing || this.readonly) {
      return;
    }
    this.editing = true;
    setTimeout(() => {
      this.textElement?.nativeElement.focus();
      this.textElement?.nativeElement.select();
    }, 500);
  }

  public requestEditData(): void {
    if (this.editing || this.readonly) {
      return;
    }
    this.editData.emit(this._tile);
  }

  public cancel(): void {
    this.editing = false;
  }

  public save(): void {
    if (this.form.invalid || this.readonly || !this._tile) {
      return;
    }
    this.text = this.editedText.value.trim();
    if (!this._tile.data) {
      this._tile.data = {};
    }
    this._tile.data[TEXT_TILE_TEXT_DATA_NAME] = this.text;
    this.tileChange.emit(this._tile);
    this.editing = false;
  }
}
