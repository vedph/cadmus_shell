import { Observable } from 'rxjs';
import {
  ThesauriSet,
  ComponentCanDeactivate,
  Part,
} from '@myrmidon/cadmus-core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPartQueryBase } from './edit-part-query-base';
import { EditPartServiceBase } from './edit-part-service-base';
import { EditItemQuery } from './edit-item.query';
import { EditItemService } from './edit-item.service';

/**
 * Base class for part feature editors.
 * A part feature editor is a wrapper component, linking a part edit
 * state (accessed from a part query and loaded with a part service)
 * to a corresponding wrapped UI editor.
 * It implements ComponentCanDeactivate to allow using the
 * PendingChangesGuard. To this end, it tracks the dirty state of
 * the edited data coming from 2 different sources: the wrapped editor
 * state (from its "root" form), and the store edit state. This is
 * set to dirty when a save attempt fails.
 * Thus, at the end the user will be prompted when closing an editor
 * either because he has changed data in it, or because he attempted
 * a save without success.
 */
export abstract class EditPartFeatureBase implements ComponentCanDeactivate {
  private _formDirty: boolean;
  private _stateDirty: boolean;

  /**
   * The part being edited (from the local store).
   */
  public part$: Observable<Part>;
  /**
   * The thesauri requested for editing this part.
   */
  public thesauri$: Observable<ThesauriSet>;

  /**
   * The item ID of the edited part, as got from the route.
   */
  public itemId: string;
  /**
   * The part type ID of the edited part, as got from the route.
   */
  public typeId: string | null;
  /**
   * The part ID of the edited part, as got from the route;
   * or null for a new part.
   */
  public partId: string | null;
  /**
   * The role ID of the edited part, as got from the route,
   * or null.
   */
  public roleId: string | null;

  constructor(
    protected router: Router,
    route: ActivatedRoute,
    protected snackbar: MatSnackBar,
    private _editPartQuery: EditPartQueryBase,
    private _editPartService: EditPartServiceBase,
    private _editItemQuery: EditItemQuery,
    private _editItemService: EditItemService
  ) {
    // item ID
    this.itemId = route.snapshot.params.iid;
    // type ID (from "TYPEID/:pid")
    this.typeId = route.snapshot.routeConfig.path.substr(
      0,
      route.snapshot.routeConfig.path.indexOf('/')
    );
    // part ID or null (if "new")
    this.partId = route.snapshot.params.pid;
    if (this.partId === 'new') {
      this.partId = null;
    }
    // role ID or null (if "default")
    this.roleId = route.snapshot.queryParams.rid;
    if (this.roleId === 'default') {
      this.roleId = null;
    }

    // connect _stateDirty to the value observed in the part state
    this._editPartQuery.selectDirty().subscribe((d: boolean) => {
      console.log('part dirty change (from state): ' + d);
      this._stateDirty = d;
    });
  }

  /**
   * Implementation of ComponentCanDeactivate. The editor can deactivate
   * when both its "root" form in the wrapped UI editor and the edit state
   * are not dirty. The form gets dirty when edited by the user; the edit
   * state gets dirty after a failed save attempt.
   */
  public canDeactivate(): boolean {
    // can-deactivate from dirty
    return !this._formDirty && !this._stateDirty;
  }

  private ensureItemLoaded(id: string): void {
    if (!this._editItemQuery.hasItem(id)) {
      this._editItemService.load(id);
    }
  }

  /**
   * Initialize the editor. You MUST call this in your OnInit.
   *
   * @param thesauriIds The optional ID(s) of the thesauri sets you want
   * to use in your editor.
   */
  protected initEditor(thesauriIds: string[] | null): void {
    // connect part and thesauri to state via query
    this.part$ = this._editPartQuery.selectPart();
    this.thesauri$ = this._editPartQuery.selectThesauri();

    // load item if required
    this.ensureItemLoaded(this.itemId);

    // load part (none if new) and thesauri
    this._editPartService.load(
      this.partId, // a new part has null here
      thesauriIds,
      // for a new part, we must supply item and role
      this.itemId,
      this.typeId,
      this.roleId
    );
  }

  /**
   * Called when the wrapped editor dirty state changes.
   * In the HTML template, you MUST bind this handler to the dirtyChange event
   * emitted by your wrapped editor (i.e. (dirtyChange)="onDirtyChange($event)").
   *
   * @param value The value of the dirty state.
   */
  public onDirtyChange(value: boolean): void {
    console.log('part dirty change (from editor): ' + value);
    this._formDirty = value;
  }

  /**
   * Save the part.
   *
   * @param part The part to be saved.
   */
  public save(part: Part): void {
    // save via part service, which invokes item service
    // for the backend, and then updates the part's store
    this._editPartService.save(part).then(
      (saved: Part) => {
        // update the route-defined part ID if it was null (new part)
        if (!this.partId) {
          this.partId = saved.id;
        }
        console.log('Part saved: ' + saved.id);
        this.snackbar.open('Part saved', 'OK', {
          duration: 3000,
        });
      },
      (error) => {
        console.error(error);
        this.snackbar.open('Error saving part', 'OK');
      }
    );
  }

  /**
   * Close the editor by navigating back to the part's item.
   */
  public close(): void {
    this.router.navigate(['items', this.itemId]);
  }
}
