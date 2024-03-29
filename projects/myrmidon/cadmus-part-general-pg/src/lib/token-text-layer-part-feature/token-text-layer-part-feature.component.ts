import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import {
  TokenLocation,
  LibraryRouteService,
  TextLayerService,
  ComponentCanDeactivate,
  LayerHint,
} from '@myrmidon/cadmus-core';
import {
  EditLayerPartQuery,
  EditLayerPartService,
  EditItemQuery,
  EditItemService,
} from '@myrmidon/cadmus-state';
import { AuthService } from '@myrmidon/cadmus-api';
import { DialogService } from '@myrmidon/ng-mat-tools';

/**
 * Token-based text layer part feature editor. This is a special type of editor,
 * rather than being a simple wrapper like the others; it is used for editing
 * any text layer (using token-based coordinates), whatever the type of its
 * fragments. Being a sort of portal for accessing a fragments editor, it has
 * no save capability: the single fragments are edited and saved as needed.
 */
@Component({
  selector: 'cadmus-token-text-layer-part-feature',
  templateUrl: './token-text-layer-part-feature.component.html',
  styleUrls: ['./token-text-layer-part-feature.component.css'],
})
export class TokenTextLayerPartFeatureComponent
  implements OnInit, ComponentCanDeactivate
{
  public itemId: string;
  public partId?: string;
  public roleId?: string;

  public loading$: Observable<boolean | undefined>;
  public error$: Observable<string | undefined>;
  public baseText$: Observable<string | undefined>;
  public locations$: Observable<TokenLocation[] | undefined>;
  public refreshingBreakChance$: Observable<boolean | undefined>;
  public breakChance$: Observable<number>;
  public layerHints$: Observable<LayerHint[]>;
  public patchingLayer$: Observable<boolean | undefined>;
  public deletingFragment$: Observable<boolean | undefined>;

  public pickedLocation?: string;
  public userLevel: number;

  public textSize: number;

  constructor(
    route: ActivatedRoute,
    private _router: Router,
    private _editQuery: EditLayerPartQuery,
    private _editService: EditLayerPartService,
    private _textLayerService: TextLayerService,
    private _editItemQuery: EditItemQuery,
    private _editItemService: EditItemService,
    private _libraryRouteService: LibraryRouteService,
    private _dialogService: DialogService,
    authService: AuthService
  ) {
    this.textSize = 14;
    this.itemId = route.snapshot.params.iid;
    this.partId = route.snapshot.params.pid;
    if (this.partId === 'new') {
      this.partId = undefined;
    }
    this.roleId = route.snapshot.queryParams.rid;
    if (this.roleId === 'default') {
      this.roleId = undefined;
    }
    this.userLevel = authService.getCurrentUserLevel();

    this.loading$ = this._editQuery.selectLoading();
    this.error$ = this._editQuery.selectError();
    this.baseText$ = this._editQuery.select((state) => state.baseText);
    this.locations$ = this._editQuery.select((state) => state.locations);
    this.refreshingBreakChance$ = this._editQuery.selectRefreshingBreakChance();
    this.breakChance$ = this._editQuery.selectBreakChance();
    this.layerHints$ = this._editQuery.selectLayerHints();
    this.patchingLayer$ = this._editQuery.selectPatchingLayers();
    this.deletingFragment$ = this._editQuery.selectDeletingFragment();
  }

  public canDeactivate(): boolean {
    return true;
  }

  private ensureItemLoaded(id: string): void {
    if (!this._editItemQuery.hasItem(id)) {
      this._editItemService.load(id);
    }
  }

  public makeLarger(): void {
    const size = this.textSize + 2;
    if (size > 24) {
      return;
    }
    this.textSize = size;
  }

  public makeSmaller(): void {
    const size = this.textSize - 2;
    if (size < 12) {
      return;
    }
    this.textSize = size;
  }

  ngOnInit(): void {
    // when the base text changes, load all the fragments locations
    // this.baseText$.subscribe(_ => {
    //   this.loadAllFragmentLocations();
    // });

    // ensure the container item is loaded
    this.ensureItemLoaded(this.itemId);

    // load the layer part data
    if (this.partId) {
      this._editService.load(this.itemId, this.partId);
    }
  }

  public deleteFragment() {
    const range = this._textLayerService.getSelectedRange();
    if (!range) {
      return;
    }
    const location = this._textLayerService.getSelectedLocationForEdit(range);
    if (!location) {
      return;
    }

    this._dialogService
      .confirm('Delete Fragment', `Delete the fragment at ${location}?`)
      .subscribe((ok: boolean) => {
        if (ok) {
          // find the fragment and remove it from the part
          const i = this._editQuery
            .getValue()!
            .part!.fragments.findIndex((p) => {
              return TokenLocation.parse(p.location)?.overlaps(location);
            });
          if (i === -1) {
            return;
          }
          this._editService.deleteFragment(location);
        }
      });
  }

  public deleteFragmentFromHint(hint: LayerHint): void {
    const loc = TokenLocation.parse(hint.location);
    if (loc) {
      this._editService.deleteFragment(loc);
    }
  }

  public refreshBreakChance(): void {
    this._editService.refreshBreakChance();
  }

  private navigateToFragmentEditor(loc: string): void {
    const part = this._editQuery.getValue().part;
    if (!part) {
      return;
    }

    const { route, rid } = this._libraryRouteService.buildFragmentEditorRoute(
      this._editItemQuery.getValue().facet!.partDefinitions,
      part.itemId,
      part.id,
      part.typeId,
      part.roleId,
      loc
    );

    // navigate to the editor
    this._router.navigate(
      [route],
      rid
        ? {
            queryParams: {
              rid: part.roleId,
            },
          }
        : {}
    );
  }

  public editFragment(): void {
    const range = this._textLayerService.getSelectedRange();
    if (!range) {
      return;
    }
    const location = this._textLayerService.getSelectedLocationForEdit(range);
    if (location) {
      this.navigateToFragmentEditor(location.toString());
    }
  }

  public editFragmentFromHint(hint: LayerHint): void {
    this.navigateToFragmentEditor(hint.location);
  }

  public addFragment(): void {
    const range = this._textLayerService.getSelectedRange();
    if (!range) {
      return;
    }
    const location = this._textLayerService.getSelectedLocationForNew(
      range,
      this._editQuery.getValue()?.baseText || ''
    );
    if (location) {
      this.navigateToFragmentEditor(location.toString());
    }
  }

  public moveFragmentFromHint(hint: LayerHint): void {
    if (
      !this.pickedLocation ||
      this.pickedLocation === hint.location ||
      !this.partId
    ) {
      return;
    }
    this._editService.applyLayerPatches(this.partId, [
      `mov ${hint.location} ${this.pickedLocation}`,
    ]);
  }

  public applyLayerPatches(patches: string[]): void {
    if (this.partId) {
      this._editService.applyLayerPatches(this.partId, patches);
    }
  }

  public pickLocation(): void {
    const range = this._textLayerService.getSelectedRange();
    if (!range) {
      return;
    }
    const location = this._textLayerService.getSelectedLocationForNew(
      range,
      this._editQuery.getValue()?.baseText || ''
    );
    if (location) {
      this.pickedLocation = location.toString();
    }
  }

  public close(): void {
    this._router.navigate(['/items', this.itemId]);
  }
}
