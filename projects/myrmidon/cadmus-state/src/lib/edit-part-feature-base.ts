import { Observable } from 'rxjs';
import { ThesauriSet, ComponentCanDeactivate, Part } from '@myrmidon/cadmus-core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPartQueryBase } from './edit-part-query-base';
import { EditPartServiceBase } from './edit-part-service-base';
import { EditItemQuery } from './edit-item.query';
import { EditItemService } from './edit-item.service';

/**
 * Base class for part feature editors.
 * A part feature editor is a wrapper component, linking a part edit state
 * (accessed from a part query and loaded with a part service) to a corresponding
 * child UI editor.
 * It implements ComponentCanDeactivate to allow using the PendingChangesGuard.
 * To this end, it tracks the dirty state of the edited data coming from 2
 * different sources: the wrapped editor state (from its "root" form), and
 * the store edit state. This is set to dirty when a save attempt fails.
 * Thus, at the end the user will be prompted when closing an editor either
 * because he has changed data in it, or because he attempted a save without
 * success.
 */
export abstract class EditPartFeatureBase implements ComponentCanDeactivate {
  private _formDirty: boolean;
  private _stateDirty: boolean;

  public json$: Observable<string>;
  public thesauri$: Observable<ThesauriSet>;

  public itemId: string;
  public partId: string;
  public roleId: string;

  constructor(
    protected router: Router,
    route: ActivatedRoute,
    protected snackbar: MatSnackBar,
    private _editPartQuery: EditPartQueryBase,
    private _editPartService: EditPartServiceBase,
    private _editItemQuery: EditItemQuery,
    private _editItemService: EditItemService
  ) {
    this.itemId = route.snapshot.params.iid;
    this.partId = route.snapshot.params.pid;
    if (this.partId === 'new') {
      this.partId = null;
    }
    this.roleId = route.snapshot.queryParams.rid;
    if (this.roleId === 'default') {
      this.roleId = null;
    }

    // connect _stateDirty to the value of the edit state
    this._editPartQuery.selectDirty().subscribe((d: boolean) => {
      console.log('part-state dirty change: ' + d);
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
   * @param thesauriIds The optional ID(s) of the thesauri sets you want
   * to use in your editor.
   */
  protected initEditor(thesauriIds: string[] | null): void {
    this.json$ = this._editPartQuery.selectJson(
      this.itemId,
      this.partId,
      this.roleId
    );
    this.thesauri$ = this._editPartQuery.selectThesauri();
    // load item if required
    this.ensureItemLoaded(this.itemId);
    // load part (none if new) and thesauri
    this._editPartService.load(this.partId, thesauriIds);
  }

  /**
   * Called when the wrapped editor dirty state changes.
   * In the HTML template, you MUST bind this handler to the dirtyChange event
   * emitted by your wrapped editor (i.e. (dirtyChange)="onDirtyChange($event)").
   * @param value The value of the dirty state.
   */
  public onDirtyChange(value: boolean): void {
    console.log('part dirty change: ' + value);
    this._formDirty = value;
  }

  /**
   * Save the part.
   * @param json The JSON code representing the edited part.
   */
  public save(json: string): void {
    this._editPartService.save(json).then(
      (part: Part) => {
        // update part ID if it was null (new part)
        if (!this.partId) {
          this.partId = part.id;
        }
        console.log('Part saved: ' + part.id);
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
