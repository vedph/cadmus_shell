import { Injectable } from '@angular/core';
import { GraphService, NodeFilter, NodeResult } from '@myrmidon/cadmus-api';
import { forkJoin, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { GraphNodesStore } from './graph-nodes.store';

@Injectable({ providedIn: 'root' })
export class GraphNodesService {
  constructor(
    private _graphService: GraphService,
    private _store: GraphNodesStore
  ) {}

  /**
   * Update the filter in the store.
   * @param filter The filter.
   */
  public updateFilter(filter: NodeFilter): void {
    this._store.update({
      filter: filter,
    });
  }

  /**
   * Set the linked node used in filter.
   *
   * @param node The node or null.
   */
  public setLinkedNode(node?: NodeResult | null): void {
    this._store.update({
      linkedNode: node ? node : undefined,
    });
  }

  /**
   * Set the linked node used in filter by its ID.
   *
   * @param id The node ID.
   */
  public setLinkedNodeId(id?: number): void {
    if (!id) {
      this._store.update({
        linkedNode: undefined,
      });
      return;
    }
    this._graphService
      .getNode(id)
      .pipe(take(1))
      .subscribe(
        (node) => {
          this.setLinkedNode(node);
        },
        (error) => {
          console.warn('Node ID not found: ' + id);
        }
      );
  }

  /**
   * Add the specified node to the filter class nodes.
   * If the node already exists, nothing is done.
   *
   * @param node The node to add.
   */
  public addClassNode(node: NodeResult): void {
    const nodes = [...(this._store.getValue().classNodes || [])];
    if (nodes.some((n) => n.id === node.id)) {
      return;
    }
    nodes.push(node);
    this._store.update({
      classNodes: nodes,
    });
  }

  /**
   * Set the class node IDs in the filter.
   *
   * @param ids The class nodes IDs or null
   */
  public setClassNodeIds(ids?: number[] | null): void {
    if (!ids || !ids.length) {
      this._store.update({
        classNodes: undefined,
      });
      return;
    }

    const requests: Observable<NodeResult>[] = [];
    ids.forEach((id) => {
      requests.push(this._graphService.getNode(id).pipe(take(1)));
    });
    forkJoin(requests)
      .pipe(take(1))
      .subscribe((results: NodeResult[]) => {
        this._store.update({
          classNodes: results,
        });
      });
  }

  /**
   * Remove the specified node from the filter class nodes.
   * If the node does not exist, nothing is done.
   *
   * @param id The node's ID.
   */
  public removeClassNode(id: number): void {
    const nodes = [...(this._store.getValue().classNodes || [])];
    const i = nodes.findIndex((n) => n.id === id);
    if (i > -1) {
      nodes.splice(i, 1);
      this._store.update({
        classNodes: nodes,
      });
    }
  }
}
