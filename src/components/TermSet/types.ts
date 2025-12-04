import { RouteComponentProps } from "react-router";
import { TsTermset, TsTerm } from "../../concepts";


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
export type TermsetEditComProps = RouteComponentProps<{ termsetId?: string }> & {
  mode?: "create" | "edit";
};
