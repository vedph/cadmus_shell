import { Component, OnInit, Input } from '@angular/core';
import { JsonSchemaService, ThesauriSet } from '@myrmidon/cadmus-core';
import { NOTE_PART_TYPEID, NOTE_PART_SCHEMA } from '../note-part';

@Component({
  selector: 'cadmus-note-part-demo',
  templateUrl: './note-part-demo.component.html',
  styleUrls: ['./note-part-demo.component.css']
})
export class NotePartDemoComponent implements OnInit {
  private _thesauriJson: string;

  public currentTabIndex: number;
  public schemaName = NOTE_PART_TYPEID;
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
    schemaService.addSchema(NOTE_PART_TYPEID, NOTE_PART_SCHEMA);
  }

  ngOnInit(): void {
  }

  public onCodeSaved(): void {
    this.currentTabIndex = 1;
  }

  public onEditorSaved(): void {
    this.currentTabIndex = 0;
  }
}
