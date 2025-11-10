import { createContext } from "react";
import { TsTermset } from "../concepts";
import { CollectionDataResponse } from "../api/types/collectionTypes";

const blueprint = {
  user: null,
  isUserSystemAdmin: false,
  reportsListForAdmin: [],
  userSettings: {
    activeCollection: { title: "", ontology_ids: [] } as CollectionDataResponse,
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
  setUserSettings: (userSettings: any) => {
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

