import type { ReactNode } from "react";

export type TreeTermNode = {
  id: string;
  iri: string;
  label?: string;
  text?: string;
  type?: string | string[];
  children?: boolean;
  childrenList?: TreeTermNode[];
  hasChildren?: boolean;
  has_children?: boolean;
  hasDirectChildren?: boolean;
  hasHierarchicalChildren?: boolean;
  hasDirectParents?: boolean;
  hasHierarchicalParents?: boolean;
  isObsolete?: boolean;
  numDescendants?: number;
  opened?: boolean;
  hierarchicalParent?: Array<string | { value: string }>;
  directParent?: Array<string | { value: string }>;
  [key: string]: any;
};

export type SelectedJumpTerm = {
  iri: string | null;
  label?: string | null;
};

export type DataTreeProps = {
  rootNodes: TreeTermNode[];
  obsoleteTerms?: TreeTermNode[];
  rootNodesForSkos: TreeTermNode[];
  componentIdentity: string;
  key?: string;
  withPreferredRoots?: boolean;
  handlePreferredRootChange?: (withPreferredRoots: boolean) => Promise<void>;
};

export type TreeProps = DataTreeProps & {
  selectedNodeIri?: string;
  handleNodeSelectionInDataTree: (
    selectedNodeIri: string,
    showDetailTable: boolean,
  ) => void;
  individualViewChanger?: React.MouseEventHandler<HTMLButtonElement> | "";
  handleResetTreeInParent: () => void;
  jumpToIri?: string | null;
  handleJumtoSelection: (selectedTerm: SelectedJumpTerm | null) => void;
  rootNodeNotExist?: boolean;
  isIndividual?: boolean;
  showListSwitchEnabled?: boolean;
  withPreferredRoots?: boolean;
  handlePreferredRootChange?: (withPreferredRoots: boolean) => Promise<void>;
};

export type TreeDomContent =
  | ReactNode
  | {
      _html_: string;
    };

export type BuildTreeResult = {
  treeDomContent: ReactNode;
  selectedItemId: string | number | null;
};
