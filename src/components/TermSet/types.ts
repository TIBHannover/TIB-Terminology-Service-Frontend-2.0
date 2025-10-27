import TsTerm from "../../concepts/term";
import TsTermset from "../../concepts/termset";

export type AddToTermsetModalComProps = {
  modalId?: string;
  btnClass?: string;
  term?: TsTerm;
}

export type AddTermModalComProps = {
  modalId?: string;
  termset?: TsTermset;
}
