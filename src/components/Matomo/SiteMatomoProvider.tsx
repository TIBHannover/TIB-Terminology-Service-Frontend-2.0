import { MatomoProvider } from "@datapunt/matomo-tracker-react";
import { ReactNode } from "react";

const SiteMatomoProvider = (props: { value: any, children: ReactNode }) => (
  //@ts-ignore
  <MatomoProvider value={props.value}>
    {props.children}
  </MatomoProvider>
);

export default SiteMatomoProvider;
