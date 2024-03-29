import { Component, OnInit } from '@angular/core';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { AuthService } from '@myrmidon/cadmus-api';
import { deepCopy } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';

import {
  TiledTextPart,
  TextTileRow,
  TILED_TEXT_PART_TYPEID,
  TEXT_TILE_TEXT_DATA_NAME,
  TextTile,
} from '../tiled-text-part';

interface Data {
  [key: string]: any;
}

@Component({
  selector: 'cadmus-tiled-text-part',
  templateUrl: './tiled-text-part.component.html',
  styleUrls: ['./tiled-text-part.component.css'],
})
export class TiledTextPartComponent
  extends ModelEditorComponentBase<TiledTextPart>
  implements OnInit
{
  private _editedDataTile?: TextTile;
  private _editedDataRow?: TextTileRow;

  public selectedTile?: TextTile;
  public form: FormGroup;
  public citation: FormControl;
  public rows: TextTileRow[];
  public editedData?: Data;
  public editedDataTitle?: string;
  public currentTabIndex: number;

  constructor(
    authService: AuthService,
    formBuilder: FormBuilder,
    private _dialogService: DialogService
  ) {
    super(authService);
    this.currentTabIndex = 0;
    this.rows = [];
    // form
    this.citation = formBuilder.control(null, Validators.maxLength(1000));
    this.form = formBuilder.group({
      citation: this.citation,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  private updateForm(model: TiledTextPart): void {
    if (!model) {
      this.form.reset();
      this.rows = [];
      return;
    }
    this.citation.setValue(model.citation);
    this.rows = model.rows || [];
    this.form.markAsPristine();
  }

  protected onModelSet(model: TiledTextPart): void {
    this.updateForm(deepCopy(model));
  }

  /**
   * Recalculate the coordinates of all the tiles in this set,
   * according to the tiles position.
   */
  private adjustCoords(): void {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      row.y = i + 1;
      if (row.tiles) {
        for (let j = 0; j < row.tiles.length; j++) {
          row.tiles[j].x = j + 1;
        }
      }
    }
  }

  protected getModelFromForm(): TiledTextPart {
    let part = this.model;
    if (!part) {
      part = {
        itemId: this.itemId || '',
        id: '',
        typeId: TILED_TEXT_PART_TYPEID,
        roleId: this.roleId,
        timeCreated: new Date(),
        creatorId: '',
        timeModified: new Date(),
        userId: '',
        citation: '',
        rows: [],
      };
    }
    // ensure that form's coordinates are ok
    this.adjustCoords();
    // set part's citation and rows
    part.citation = this.citation.value ? this.citation.value.trim() : null;
    part.rows = this.rows;
    return part;
  }

  /**
   * Append a new row at the bottom.
   */
  public addRow(): void {
    const data: { [key: string]: any } = {};
    data[TEXT_TILE_TEXT_DATA_NAME] = 'text1';

    this.rows.push({
      y: this.rows.length + 1,
      tiles: [
        {
          x: 1,
          data: data,
        },
      ],
    });
    this.form.markAsDirty();
  }

  /**
   * Append a new tile at the end of the specified row.
   * @param row The row to add the tile to.
   */
  public addTile(row: TextTileRow): void {
    const x = row.tiles ? row.tiles.length + 1 : 1;
    const data: { [key: string]: any } = {};
    data[TEXT_TILE_TEXT_DATA_NAME] = 'text' + x;
    if (!row.tiles) {
      row.tiles = [];
    }
    row.tiles.push({
      x: x,
      data: data,
    });
    this.form.markAsDirty();
  }

  /**
   * Delete the selected tile, if any.
   */
  public deleteSelectedTile(): void {
    if (!this.selectedTile) {
      return;
    }

    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      if (row.tiles) {
        const index = row.tiles.indexOf(this.selectedTile);
        if (index > -1) {
          this.selectedTile =
            index + 1 < row.tiles.length
              ? row.tiles[index + 1]
              : row.tiles.length > 1
              ? row.tiles[index - 1]
              : undefined;
          row.tiles.splice(index, 1);
          this.adjustCoords();
          this.form.markAsDirty();
          break;
        }
      }
    }
  }

  /**
   * Delete the row at the specified index.
   * @param rowIndex The row's index.
   */
  public deleteRow(rowIndex: number): void {
    this._dialogService
      .confirm('Confirm Deletion', `Delete row #"${rowIndex + 1}"?`)
      .subscribe((ok: boolean) => {
        if (!ok) {
          return;
        }
        this.rows.splice(rowIndex, 1);
        this.adjustCoords();
        this.form.markAsDirty();
      });
  }

  /**
   * Move the row at the specified index up.
   * @param rowIndex The row index.
   */
  public moveRowUp(rowIndex: number): void {
    if (rowIndex < 1) {
      return;
    }
    moveItemInArray(this.rows, rowIndex, rowIndex - 1);
    this.adjustCoords();
    this.form.markAsDirty();
  }

  /**
   * Move the row at the specified index down.
   * @param rowIndex The row index.
   */
  public moveRowDown(rowIndex: number): void {
    if (rowIndex + 1 === this.rows.length) {
      return;
    }
    moveItemInArray(this.rows, rowIndex, rowIndex + 1);
    this.adjustCoords();
    this.form.markAsDirty();
  }

  public drop(event: CdkDragDrop<TextTile[]>, row: TextTileRow): void {
    // https://material.angular.io/cdk/drag-drop/overview
    moveItemInArray(row.tiles, event.previousIndex, event.currentIndex);
    this.adjustCoords();
    this.form.markAsDirty();
  }

  public onTileChange(tile: TextTile): void {
    this.form.markAsDirty();
  }

  public editRowData(row: TextTileRow): void {
    this._editedDataRow = row;
    this._editedDataTile = undefined;
    this.editedDataTitle = `Row ${row.y}`;
    this.editedData = row.data;
    this.currentTabIndex = 1;
  }

  public editTileData(tile: TextTile): void {
    this._editedDataTile = tile;
    this._editedDataRow = undefined;
    this.editedDataTitle = `Tile ${this.getTileCoords(tile)}`;
    this.editedData = tile.data;
    this.currentTabIndex = 1;
  }

  public closeDataEditor(): void {
    this.currentTabIndex = 0;
    this._editedDataRow = undefined;
    this.editedDataTitle = undefined;
    this.editedData = undefined;
  }

  public saveEditedData(data: Data): void {
    if (this._editedDataTile) {
      this._editedDataTile.data = data;
    } else {
      this._editedDataRow!.data = data;
    }
    this.form.markAsDirty();
    this.closeDataEditor();
  }

  public getTileCoords(tile?: TextTile): string {
    if (!tile) {
      tile = this.selectedTile;
    }
    if (!tile) {
      return '';
    } else {
      let y = 0;
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].tiles.indexOf(tile) > -1) {
          y = i + 1;
          break;
        }
      }
      return `${y},${tile.x}`;
    }
  }
}
