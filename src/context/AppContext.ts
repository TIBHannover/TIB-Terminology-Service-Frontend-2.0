import { createContext } from "react";
import { TsTermset } from "../concepts";
import { CollectionDataResponse } from "../api/types/collectionTypes";


type Blueprint = {
  user: any,
  isUserSystemAdmin: boolean,
  reportsListForAdmin: Array<any>,
  userSettings: any,
  setUserSettings: (userSettings: any) => void,
  userTermsets: Array<any>,
  setUserTermsets: (termsets: Array<any>) => void,
  includeImportedTerms: boolean,
  setIncludeImportedTerms: (includeImportedTerms: boolean) => void
}


const blueprint: Blueprint = {
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

