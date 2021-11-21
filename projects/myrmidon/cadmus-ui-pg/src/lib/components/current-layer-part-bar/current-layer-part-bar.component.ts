import { Component, OnInit } from '@angular/core';
import {
  EditItemQuery,
  EditLayerPartQuery,
  AppQuery,
} from '@myrmidon/cadmus-state';
import { TextLayerPart } from '@myrmidon/cadmus-core';
import { FacetService } from '@myrmidon/cadmus-api';

@Component({
  selector: 'cadmus-current-layer-part-bar',
  templateUrl: './current-layer-part-bar.component.html',
  styleUrls: ['./current-layer-part-bar.component.css'],
})
export class CurrentLayerPartBarComponent implements OnInit {
  constructor(
    private _appQuery: AppQuery,
    private _itemQuery: EditItemQuery,
    private _partQuery: EditLayerPartQuery,
    private _facetService: FacetService
  ) {}

  public typeId?: string;
  public roleId?: string;
  public color?: string;

  private getTypeIdName(typeId: string): string {
    const state = this._appQuery.getValue();
    if (!state || !state.typeThesaurus) {
      return typeId;
    }
    // strip :suffix if any
    const i = typeId.lastIndexOf(':');
    if (i > -1) {
      typeId = typeId.substr(0, i);
    }
    const entry = state.typeThesaurus.entries?.find((e) => e.id === typeId);
    return entry ? entry.value : typeId;
  }

  private getRoleIdName(roleId?: string): string | undefined {
    if (!roleId || !roleId.startsWith('fr.')) {
      return roleId;
    }
    return this.getTypeIdName(roleId);
  }

  private getPartColor(typeId: string, roleId?: string): string {
    const state = this._itemQuery.getValue();
    return this._facetService.getPartColor(typeId, roleId, state?.facet);
  }

  private updateLabels(): void {
    const part: TextLayerPart | undefined = this._partQuery.getValue().part;
    if (!part) {
      this.typeId = undefined;
      this.roleId = undefined;
      this.color = undefined;
      return;
    } else {
      this.typeId = this.getTypeIdName(part.typeId);
      this.roleId = this.getRoleIdName(part.roleId);
      this.color = this.getPartColor(part.typeId, part.roleId);
    }
  }

  ngOnInit(): void {
    this._itemQuery.select().subscribe((_) => {
      this.updateLabels();
    });
    this._partQuery.select().subscribe((_) => {
      this.updateLabels();
    });
  }
}
