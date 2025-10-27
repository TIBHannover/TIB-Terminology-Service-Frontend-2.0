import { createContext } from "react";
import TsTermset from "../concepts/termset";

const blueprint = {
  user: null,
  isUserSystemAdmin: false,
  reportsListForAdmin: [],
  userSettings: {
    activeCollection: { title: "", ontology_ids: [] },
    userCollectionEnabled: false,
    advancedSearchEnabled: false,
    activeSearchSetting: {
      id: "",
      title: "",
      user_id: "",
      setting: {
        selectedMetaData: [],
        selectedSearchUnderTerms: [],
        selectedSearchUnderAllTerms: [],
      },
      description: "",
      created_at: "",
      updated_at: "",
    },
    activeSearchSettingIsModified: false,
  },
  setUserSettings: () => {
    /* set userSettings */
  },
  userTermsets: [] as TsTermset[],
  setUserTermsets: (termsets: TsTermset[]) => {
    /* set user term sets*/
  },
  includeImportedTerms: true,
  setIncludeImportedTerms: () => { }
};

export const AppContext = createContext(blueprint);

