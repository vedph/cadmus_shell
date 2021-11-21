import { Injectable } from '@angular/core';
import { ThesaurusService } from '@myrmidon/cadmus-api';
import {
  HierarchyItemBrowserStore,
  TreeNode,
} from './hierarchy-item-browser.store';

@Injectable({ providedIn: 'root' })
export class HierarchyItemBrowserService {
  constructor(
    private _store: HierarchyItemBrowserStore,
    private _thesaurusService: ThesaurusService
  ) {}

  /**
   * Set the nodes in the store.
   *
   * @param nodes The nodes.
   */
  public setNodes(nodes: TreeNode[]): void {
    this._store.setNodes(nodes);
  }

  /**
   * Load the tags thesaurus.
   *
   * @param thesaurusId The tags thesaurus ID.
   */
  public loadTags(thesaurusId: string): void {
    this._store.setLoading(true);
    this._thesaurusService.getThesaurus(thesaurusId, true).subscribe(
      (thesaurus) => {
        this._store.setLoading(false);
        this._store.setTags(thesaurus.entries?.length ? thesaurus : undefined);
      },
      (error) => {
        console.error(error);
        this._store.setLoading(false);
        this._store.setError('Error loading tags thesaurus ' + thesaurusId);
      }
    );
  }
}
