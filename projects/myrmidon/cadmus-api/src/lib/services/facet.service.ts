import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {
  ErrorService,
  FacetDefinition,
  PartDefinition,
  EnvService,
} from '@myrmidon/cadmus-core';

@Injectable({ providedIn: 'root' })
export class FacetService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Get a list of facets.
   * @returns Observable with facets array.
   */
  public getFacets(): Observable<FacetDefinition[]> {
    const url =
      this._env.get('apiUrl') + this._env.get('databaseId') + '/facets';

    return this._http
      .get<FacetDefinition[]>(url)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the facet with the specified ID.
   *
   * @param id The facet's ID.
   */
  public getFacet(id: string): Observable<FacetDefinition> {
    const url =
      this._env.get('apiUrl') + this._env.get('databaseId') + `/facets/${id}`;

    return this._http
      .get<FacetDefinition>(url)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the facet assigned to the item with the specified ID.
   *
   * @param itemId The item's ID.
   */
  public getFacetFromItemId(itemId: string): Observable<FacetDefinition> {
    const url =
      this._env.get('apiUrl') +
      this._env.get('databaseId') +
      `/facets/items/${itemId}`;

    return this._http
      .get<FacetDefinition>(url)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get a list of all the parts defined in the specified facet.
   *
   * @param id The facet ID.
   * @param idIsItem True if the received ID refers to an item's ID rather
   * than to the facet ID. In this case, the item's facet will be retrieved
   * first, and then used to get the requested result.
   * @param noRoles True to ignore the roles when collecting parts from
   *  facets. In this case, you will get just 1 part for each part type.
   * @returns Observable with part definitions array.
   */
  public getFacetParts(
    id: string,
    idIsItem: boolean,
    noRoles = false
  ): Observable<PartDefinition[]> {
    let url = idIsItem
      ? this._env.get('apiUrl') +
        this._env.get('databaseId') +
        `/item-facets/${id}/parts`
      : this._env.get('apiUrl') +
        this._env.get('databaseId') +
        `/facets/${id}/parts`;
    if (noRoles) {
      url += '?noRoles=true';
    }

    return this._http
      .get<PartDefinition[]>(url)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the text layer part type ID if any.
   * @returns Observable of an object with property typeId=result or null.
   */
  public getTextLayerPartTypeId(): Observable<{ typeId: string }> {
    const url =
      this._env.get('apiUrl') +
      this._env.get('databaseId') +
      '/facets/layer-type-id';

    return this._http
      .get<{ typeId: string }>(url)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the color of the part with the specified type and role IDs, inside
   * the specified facet (if any).
   *
   * @param typeId The part's type ID.
   * @param roleId The part's optional role ID.
   * @param facet The facet definition including the part being requested.
   */
  public getPartColor(
    typeId: string,
    roleId: string,
    facet: FacetDefinition
  ): string {
    let def: PartDefinition = null;
    if (facet) {
      def = facet.partDefinitions.find((d) => {
        return d.typeId === typeId && (!roleId || roleId === d.roleId);
      });
      if (!def) {
        def = facet.partDefinitions.find((d) => {
          return d.typeId === typeId;
        });
      }
    }
    return def ? '#' + def.colorKey : '#f0f0f0';
  }
}
