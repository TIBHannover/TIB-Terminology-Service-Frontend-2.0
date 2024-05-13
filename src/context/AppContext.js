import { createContext } from "react";

const blueprint = {
    user: null,
    isUserSystemAdmin: false,
    reportsListForAdmin: [],
    activeUserCollection: {"title": "", "ontology_ids": []},
    setActiveUserCollection: () => {/* set activeUserCollection */},
    userCollectionEnabled: false,
    setUserCollectionEnabled: () => {/* set userCollectionEnabled */},
};


export const AppContext = createContext(blueprint)