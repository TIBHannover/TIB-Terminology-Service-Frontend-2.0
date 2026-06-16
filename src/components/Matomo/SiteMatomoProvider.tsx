import { MatomoProvider } from "@datapunt/matomo-tracker-react";
import { ReactNode } from "react";

const Provider = MatomoProvider as any;

const SiteMatomoProvider = (props: { value: any; children: ReactNode }) => (
  <Provider value={props.value}>{props.children}</Provider>
);

export default SiteMatomoProvider;
