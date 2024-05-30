import { createContext } from "react";

const blueprint = {
    user: null,
    isUserSystemAdmin: false,
    reportsListForAdmin: [],
    userSettings: {
        activeCollection: {"title": "", "ontology_ids": []},
        userCollectionEnabled: false,
        advancedSearchEnabled: false,
        activeSearchSetting: {}
    },
    setUserSettings: () => {/* set userSettings */}       
};


export const AppContext = createContext(blueprint)