import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { FacetDefinition, PartDefinition } from '@myrmidon/cadmus-core';
import { EnvService, ErrorService } from '@myrmidon/ng-tools';

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
    return this._http
      .get<FacetDefinition[]>(`${this._env.get('apiUrl')}facets`)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the facet with the specified ID.
   *
   * @param id The facet's ID.
   */
  public getFacet(id: string): Observable<FacetDefinition> {
    return this._http
      .get<FacetDefinition>(`${this._env.get('apiUrl')}facets/${id}`)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the facet assigned to the item with the specified ID.
   *
   * @param id The item's ID.
   */
  public getFacetFromItemId(id: string): Observable<FacetDefinition> {
    return this._http
      .get<FacetDefinition>(`${this._env.get('apiUrl')}facets/items/${id}`)
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
      ? this._env.get('apiUrl')! + `item-facets/${id}/parts`
      : this._env.get('apiUrl')! + `facets/${id}/parts`;
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
    return this._http
      .get<{ typeId: string }>(`${this._env.get('apiUrl')}facets/layer-type-id`)
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
    roleId: string | undefined,
    facet: FacetDefinition | undefined
  ): string {
    let def: PartDefinition | undefined;
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
