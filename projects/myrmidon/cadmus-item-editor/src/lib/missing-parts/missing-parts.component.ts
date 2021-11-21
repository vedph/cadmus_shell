import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { PartDefinition, Part, Thesaurus } from '@myrmidon/cadmus-core';

@Component({
  selector: 'cadmus-missing-parts',
  templateUrl: './missing-parts.component.html',
  styleUrls: ['./missing-parts.component.css'],
})
export class MissingPartsComponent implements OnInit {
  private _partDefinitions?: PartDefinition[];
  private _parts?: Part[];
  private _typeThesaurus?: Thesaurus;

  public missingDefinitions: PartDefinition[];

  @Input()
  public get partDefinitions(): PartDefinition[] | undefined {
    return this._partDefinitions;
  }
  public set partDefinitions(value: PartDefinition[] | undefined) {
    this._partDefinitions = value;
    this.updateMissing();
  }

  @Input()
  public get parts(): Part[] | undefined {
    return this._parts;
  }
  public set parts(value: Part[] | undefined) {
    this._parts = value;
    this.updateMissing();
  }

  /**
   * The types thesaurus.
   */
  @Input()
  public get typeThesaurus(): Thesaurus | undefined {
    return this._typeThesaurus;
  }
  public set typeThesaurus(value: Thesaurus | undefined) {
    this._typeThesaurus = value;
    this.updateMissing();
  }

  @Output()
  public addRequest: EventEmitter<PartDefinition>;

  constructor() {
    this.missingDefinitions = [];
    this.addRequest = new EventEmitter<PartDefinition>();
  }

  ngOnInit(): void {}

  private isPartPresent(typeId: string, roleId?: string): boolean {
    if (!this._partDefinitions) {
      return false;
    }
    return this._partDefinitions.some(
      (d) => d.typeId === typeId && d.roleId === roleId
    );
  }

  private updateMissing(): void {
    this.missingDefinitions.length = 0;
    if (!this._partDefinitions) {
      return;
    }

    for (let i = 0; i < this._partDefinitions.length; i++) {
      const def = this._partDefinitions[i];
      if (!this.isPartPresent(def.typeId, def.roleId)) {
        this.missingDefinitions.push(def);
      }
    }
  }
}
