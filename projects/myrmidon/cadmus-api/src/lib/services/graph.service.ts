import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorService, EnvService, DataPage } from '@myrmidon/cadmus-core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export enum NodeSourceType {
  User = 0,
  Item,
  ItemFacet,
  ItemGroup,
  Pin,
}

export interface Node {
  id: number;
  isClass?: boolean;
  label: string;
  sourceType: NodeSourceType;
  tag?: string;
  sid?: string;
}

export interface NodeResult extends Node {
  uri: string;
}

export interface NodeFilter {
  pageNumber: number;
  pageSize: number;
  uid?: string;
  isClass?: boolean;
  tag?: string;
  label?: string;
  sourceType?: NodeSourceType;
  sid?: string;
  isSidPrefix?: boolean;
  linkedNodeId?: number;
  linkedNodeRole?: 'S' | 'O';
  classIds?: number[];
}

export interface Triple {
  id: number;
  subjectId: number;
  predicateId: number;
  objectId?: number;
  sid?: string;
  tag?: string;
}

export interface TripleResult extends Triple {
  subjectUri: string;
  predicateUri: string;
  objectUri?: string;
}

export interface TripleFilter {
  pageNumber: number;
  pageSize: number;
  subjectId?: number;
  predicateId?: number;
  objectId?: number;
  objectLiteral?: string;
  sid?: string;
  isSidPrefix?: boolean;
  tag?: string;
}

/**
 * Cadmus semantic graph service.
 */
@Injectable({
  providedIn: 'root',
})
export class GraphService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Get the specified page of graph nodes.
   *
   * @param filter The nodes filter.
   * @returns A page of nodes.
   */
  public getNodes(filter: NodeFilter): Observable<DataPage<NodeResult>> {
    const url = this._env.get('apiUrl') + '/graph/nodes';

    let httpParams = new HttpParams();
    httpParams = httpParams.set('pageNumber', filter.pageNumber.toString());
    httpParams = httpParams.set('pageSize', filter.pageSize.toString());

    if (filter.uid) {
      httpParams = httpParams.set('uid', filter.uid);
    }
    if (filter.isClass !== null && filter.isClass !== undefined) {
      httpParams = httpParams.set('isClass', filter.isClass ? 'true' : 'false');
    }
    if (filter.tag) {
      httpParams = httpParams.set('tag', filter.tag);
    }
    if (filter.label) {
      httpParams = httpParams.set('label', filter.label);
    }
    if (filter.sourceType !== null && filter.sourceType !== undefined) {
      httpParams = httpParams.set('sourceType', filter.sourceType.toString());
    }
    if (filter.sid) {
      httpParams = httpParams.set('sid', filter.sid);
    }
    if (filter.isSidPrefix) {
      httpParams = httpParams.set('isSidPrefix', 'true');
    }
    if (filter.linkedNodeId) {
      httpParams = httpParams.set(
        'linkedNodeId',
        filter.linkedNodeId.toString()
      );
    }
    if (filter.linkedNodeRole) {
      httpParams = httpParams.set('linkedNodeRole', filter.linkedNodeRole);
    }
    if (filter.classIds?.length) {
      for (let i = 0; i < filter.classIds.length; i++) {
        httpParams = httpParams.set('classIds', filter.classIds[i]);
      }
    }

    return this._http
      .get<DataPage<NodeResult>>(url, {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the node with the specified ID.
   *
   * @param id The node's ID.
   * @returns The node.
   */
  public getNode(id: number): Observable<NodeResult> {
    const url = this._env.get('apiUrl') + '/graph/nodes/' + id.toString();
    return this._http
      .get<NodeResult>(url)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Add or update the specified node. A new node has id=0 and uri set;
   * an existing node has its id.
   *
   * @param node The node to add.
   * @returns The added node.
   */
  public addNode(node: NodeResult): Observable<NodeResult> {
    const url = this._env.get('apiUrl') + '/graph/nodes/';
    return this._http
      .post<NodeResult>(url, node)
      .pipe(catchError(this._error.handleError));
  }

  /**
   * Delete the node with the specified ID.
   *
   * @param id The node's ID.
   */
  public deleteNode(id: number): Observable<any> {
    const url = this._env.get('apiUrl') + '/graph/nodes/' + id.toString();
    return this._http.delete(url).pipe(catchError(this._error.handleError));
  }

  /**
   * Get the specified page of triples.
   *
   * @param filter The filter.
   * @returns The page.
   */
  public getTriples(filter: TripleFilter): Observable<DataPage<TripleResult>> {
    const url = this._env.get('apiUrl') + '/graph/triples';

    let httpParams = new HttpParams();
    httpParams = httpParams.set('pageNumber', filter.pageNumber.toString());
    httpParams = httpParams.set('pageSize', filter.pageSize.toString());

    if (filter.subjectId) {
      httpParams = httpParams.set('subjectId', filter.subjectId.toString());
    }
    if (filter.predicateId) {
      httpParams = httpParams.set('predicateId', filter.predicateId.toString());
    }
    if (filter.objectId) {
      httpParams = httpParams.set('objectId', filter.objectId.toString());
    }
    if (filter.objectLiteral) {
      httpParams = httpParams.set(
        'objectLiteral',
        filter.objectLiteral.toString()
      );
    }
    if (filter.sid) {
      httpParams = httpParams.set('sid', filter.sid);
    }
    if (filter.isSidPrefix) {
      httpParams = httpParams.set('isSidPrefix', 'true');
    }
    if (filter.tag) {
      httpParams = httpParams.set('tag', filter.tag);
    }

    return this._http
      .get<DataPage<TripleResult>>(url, {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the triple with the specified ID.
   *
   * @param id The triple's ID.
   * @returns The triple.
   */
  public getTriple(id: number): Observable<TripleResult> {
    const url = this._env.get('apiUrl') + '/graph/triples/' + id.toString();
    return this._http
      .get<TripleResult>(url)
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Add or update the specified triple.
   *
   * @param node The triple to add.
   * @returns The added triple.
   */
  public addTriple(triple: Triple): Observable<Triple> {
    const url = this._env.get('apiUrl') + '/graph/triples/';
    return this._http
      .post<Triple>(url, triple)
      .pipe(catchError(this._error.handleError));
  }

  /**
   * Delete the triple with the specified ID.
   *
   * @param id The triple's ID.
   */
  public deleteTriple(id: number): Observable<any> {
    const url = this._env.get('apiUrl') + '/graph/triples/' + id.toString();
    return this._http.delete(url).pipe(catchError(this._error.handleError));
  }
}
