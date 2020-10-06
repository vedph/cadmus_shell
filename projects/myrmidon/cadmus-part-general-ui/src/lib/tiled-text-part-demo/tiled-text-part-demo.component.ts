import { Component, OnInit, Input } from '@angular/core';
import { TILED_TEXT_PART_TYPEID, TILEDTEXTPART_SCHEMA } from '../tiled-text-part';
import { ThesauriSet, JsonSchemaService } from '@myrmidon/cadmus-core';

@Component({
  selector: 'cadmus-tiled-text-part-demo',
  templateUrl: './tiled-text-part-demo.component.html',
  styleUrls: ['./tiled-text-part-demo.component.css']
})
export class TiledTextPartDemoComponent implements OnInit {
  private _thesauriJson: string;

  public currentTabIndex: number;
  public schemaName = TILED_TEXT_PART_TYPEID;
  public modelJson: string;
  public thesauri: ThesauriSet | null;

  @Input()
  public get thesauriJson(): string {
    return this._thesauriJson;
  }
  public set thesauriJson(value: string) {
    if (this._thesauriJson === value) {
      return;
    }
    this._thesauriJson = value;
    if (value) {
      this.thesauri = JSON.parse(value);
    } else {
      this.thesauri = null;
    }
  }

  constructor(schemaService: JsonSchemaService) {
    this.currentTabIndex = 0;
    schemaService.addSchema(TILED_TEXT_PART_TYPEID, TILEDTEXTPART_SCHEMA);
  }

  ngOnInit(): void {}

  public onCodeSaved(): void {
    this.currentTabIndex = 1;
  }

  public onEditorSaved(): void {
    this.currentTabIndex = 0;
  }
}
