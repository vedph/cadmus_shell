import { StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { ItemInfo, Thesaurus } from '@myrmidon/cadmus-core';
import { Injectable } from '@angular/core';

export const HIERARCHY_ITEM_BROWSER_TYPEID =
  'it.vedph.item-browser.mongo.hierarchy';

export interface HierarchyItemBrowserPayload {
  y: number;
  x: number;
  childCount: number;
}

/**
 * Generic tree node.
 */
export interface TreeNode {
  /**
   * The 0-based depth level.
   */
  level: number;
  /**
   * The number of the page this node belongs to.
   */
  pageNumber: number;
  /**
   * This property tells whether the node is a "prev" pager (-1),
   * a "next" pager (+1), or an item node (falsy).
   */
  pager?: number;
  loading?: boolean;
}

/**
 * A pager node, used to add paging controls inside a tree.
 */
export interface PagerTreeNode extends TreeNode {
  pageCount: number;
  total: number;
}

/**
 * An item node, representing the item in a tree.
 */
export interface ItemTreeNode extends TreeNode {
  id: string;
  label: string;
  facetId: string;
  flags: number;
  description: string;
  payload: HierarchyItemBrowserPayload;
}

export interface HierarchyItemBrowserState
  extends EntityState<ItemInfo, string> {
  nodes: TreeNode[];
  tags?: Thesaurus;
  loading?: boolean;
  error?: string;
}

const initialState: HierarchyItemBrowserState = {
  nodes: [],
};

/**
 * Store for HierarchyItemBrowserComponent. This is used only to store the
 * thesaurus tags for lookup in filtering; data displayed in the tree are
 * managed by the ItemTreeDataSource. When leaving that page, these data
 * are saved in the store to be retrieved later, when coming back to the same
 * page.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: HIERARCHY_ITEM_BROWSER_TYPEID })
export class HierarchyItemBrowserStore extends EntityStore<HierarchyItemBrowserState> {
  constructor() {
    super(initialState);
  }

  /**
   * Set the nodes so that they can be retrieved later when coming back
   * to the browser's page.
   *
   * @param value The nodes.
   */
  public setNodes(value: TreeNode[]): void {
    this.update({ nodes: value });
  }

  /**
   * Set the tags thesaurus.
   *
   * @param value The thesaurus.
   */
  public setTags(value?: Thesaurus): void {
    this.update({ tags: value });
  }
}
