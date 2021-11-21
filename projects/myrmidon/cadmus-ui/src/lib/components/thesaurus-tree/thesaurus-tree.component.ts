import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ThesaurusEntry } from '@myrmidon/cadmus-core';

interface TreeNode {
  id: string;
  label: string;
  originalLabel?: string;
  parent?: TreeNode;
  children?: TreeNode[];
  clickable?: boolean;
}

/**
 * A label rendering function which removes from a label
 * all the characters past the last colon, trimming the result.
 * This is a typical rendering when dealing with hierarchical
 * thesaurus entries, e.g. "furniture: table: color", where
 * we can shorten the label to just "color", as "furniture"
 * and "table" are its ancestors.
 */
export const renderLabelFromLastColon = (label: string): string => {
  if (!label) {
    return label;
  }
  const i = label.lastIndexOf(':');
  return i > -1 && i + 1 < label.length ? label.substr(i + 1).trim() : label;
};

/**
 * Thesaurus tree component.
 * This component displays a set of hierarchical thesaurus entries
 * in a tree, provided that each entry marks its hierarchy with
 * dots. For instance, say you have the hierarchy "furniture" -
 * "type" - "color". You might have an entry whose ID is
 * "furniture.table.red", with a sibling "furniture.table.green",
 * and a parent "furniture.table". This parent is there only to
 * provide a label to the parent node, but only leaf nodes can be
 * picked by the user. Whenever one is picked, the entryChange
 * event is emitted. Note that even if you specify a label renderer
 * function, the event always emits the original label.
 */
@Component({
  selector: 'cadmus-thesaurus-tree',
  templateUrl: './thesaurus-tree.component.html',
  styleUrls: ['./thesaurus-tree.component.css'],
})
export class ThesaurusTreeComponent implements OnInit {
  private _entries?: ThesaurusEntry[];

  /**
   * The thesaurus entries.
   */
  @Input()
  public get entries(): ThesaurusEntry[] | undefined {
    return this._entries;
  }
  public set entries(value: ThesaurusEntry[] | undefined) {
    if (this._entries !== value) {
      this._entries = value;
      this.initTree();
    }
  }

  /**
   * The label for the root node.
   */
  @Input()
  public rootLabel: string;
  /**
   * The optional node label rendering function.
   */
  @Input()
  public renderLabel: ((label: string) => string) | undefined;
  /**
   * Fired when a thesaurus entry is selected.
   */
  @Output()
  public entryChange: EventEmitter<ThesaurusEntry>;

  public root: TreeNode;
  public treeControl: NestedTreeControl<TreeNode>;
  public treeDataSource: MatTreeNestedDataSource<TreeNode>;

  public filter: FormControl;
  public form: FormGroup;
  public foundNodes: TreeNode[] | undefined;

  public hasChildren = (index: number, node: TreeNode) => {
    return node && node.children && node.children.length > 0;
  };

  public isRoot = (index: number, node: TreeNode) => {
    return node && node.id === '@root';
  };

  constructor(formBuilder: FormBuilder) {
    // tree
    this.entryChange = new EventEmitter<ThesaurusEntry>();
    this.treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
    this.treeDataSource = new MatTreeNestedDataSource<TreeNode>();
    this.rootLabel = '-';
    this.root = { id: '@root', label: '-', children: [] };
    // filter
    this.filter = formBuilder.control(null);
    this.form = formBuilder.group({
      filter: this.filter,
    });
  }

  ngOnInit(): void {
    this.initTree();
  }

  private initTree(): void {
    this.foundNodes = undefined;

    this.root = this.buildTreeModel(this._entries || []);
    this.treeDataSource.data = [this.root];
    // https://github.com/angular/components/issues/12469
    this.treeControl.dataNodes = this.treeDataSource.data;
  }

  private getLabel(label: string): string {
    return this.renderLabel ? this.renderLabel(label) : label;
  }

  private addNode(
    entry: ThesaurusEntry,
    separator: string,
    root: TreeNode
  ): void {
    const components = entry.id.split(separator);

    // walk the tree up to the last existing component
    let i = 0;
    let node = root;
    const idParts: string[] = [];

    // for each component:
    while (i < components.length) {
      idParts.push(components[i]);

      // stop walking when the node has no more children
      if (!node.children) {
        break;
      }
      // find target among children
      const targetId = idParts.join(separator);
      const existing = node.children.find((c) => {
        return c.id === targetId;
      });
      if (existing) {
        node = existing;
        i++;
      } else {
        break;
      }
    }

    // node is now the last existing component; use it as the ancestor
    // for all the remaining components (starting from i)
    while (i < components.length) {
      if (!node.children) {
        node.children = [];
      }
      const isLast = i + 1 === components.length;
      const label = isLast ? entry.value : components[i];
      const child: TreeNode = {
        label: isLast ? this.getLabel(label) : label,
        id: isLast ? entry.id : idParts.join(separator),
        parent: node,
        children: [],
      };
      if (label !== child.label) {
        child.originalLabel = label;
      }
      node.children.push(child);
      node = child;
      i++;
    }
  }

  /**
   * Build a tree model from a list of name=value pairs,
   * where each value can include one or more components separated by
   * the specified separator.
   * @param entries The entries to add.
   * @param separator string The separator string to use for values.
   */
  public buildTreeModel(entries: ThesaurusEntry[], separator = '.'): TreeNode {
    const root: TreeNode = {
      id: '@root',
      label: this.rootLabel || '-',
    };
    if (!entries) {
      return root;
    }
    entries.forEach((entry) => {
      this.addNode(entry, separator, root);
    });
    return root;
  }

  public onTreeNodeClick(node: TreeNode): void {
    if (node.children && node.children.length > 0) {
      return;
    }
    this.entryChange.emit({
      id: node.id,
      value: node.originalLabel || node.label,
    });
  }

  public expandAll(): void {
    this.treeControl.expandAll();
  }

  public collapseAll(): void {
    this.treeControl.collapseAll();
  }

  private expandFromNode(node: TreeNode): void {
    while (node.parent) {
      node = node.parent;
      this.treeControl.expand(node);
    }
  }

  private expandMatchingNodes(
    node: TreeNode,
    filter: string,
    found: TreeNode[]
  ): void {
    if (node.label.toLowerCase().includes(filter)) {
      found.push(node);
      this.expandFromNode(node);
    }
    if (node.children?.length) {
      node.children.forEach((child) => {
        this.expandMatchingNodes(child, filter, found);
      });
    }
  }

  public find(): void {
    if (!this.filter.value?.length) {
      return;
    }
    this.treeControl.collapseAll();
    const foundNodes: TreeNode[] = [];
    this.expandMatchingNodes(
      this.treeDataSource.data[0],
      this.filter.value.toLowerCase(),
      foundNodes
    );
    this.foundNodes = foundNodes;
  }

  public resetFilter(): void {
    this.filter.reset();
    this.foundNodes = undefined;
  }

  public isFoundNode(node: TreeNode): boolean {
    if (!this.foundNodes) {
      return false;
    }
    return this.foundNodes?.length > 0 && this.foundNodes.indexOf(node) > -1;
  }
}
