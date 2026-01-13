import { TsTerm } from "../../../concepts";

export type TermTabKeys = 'Detail' | 'Notes' | 'GraphView';

export type TermTabMetadata = Record<TermTabKeys, {
  id: string,
  keyForRenderAsTabItem: string,
  tabId: number,
  tabTitle: string,
  urlEndPoint: string
}>;


export type TermDetailComPros = {
  iri: string;
  extractKey: string;
  componentIdentity: string;
  typeForNote: string;
}


export type RenderTermDetailComProps = {
  componentIdentity: string,
  activeTab: number,
  tabChangeHandler: (e: React.MouseEvent<HTMLAnchorElement>) => void,
  noteCount: number
}


export type TermDetailTableComProp = {
  iri: string;
  componentIdentity: string;
  extractKey: string;
  node?: TsTerm;
  isIndividual?: boolean;
}

export type TableMetadata = {
  [key: string]: {
    value: any,
    isLink: boolean
  }
}


