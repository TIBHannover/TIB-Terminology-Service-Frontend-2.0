import TsTerm from "../../concepts/term";
import TsTermset from "../../concepts/termset";
import { RouteComponentProps } from "react-router";

export type AddToTermsetModalComProps = {
  modalId?: string;
  btnClass?: string;
  term?: TsTerm;
}

export type AddTermModalComProps = {
  modalId?: string;
  termset?: TsTermset;
}


export type TermsetPageComProps = RouteComponentProps<{ termsetId: string }>;
