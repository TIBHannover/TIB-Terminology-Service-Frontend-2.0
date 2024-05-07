import { createContext } from "react";

const blueprint = {
    user: null,
    isUserSystemAdmin: false,
    reportsListForAdmin: [],
    activeUserCollection: {"titile": "", "ontology_ids": []},
    setActiveUserCollection: () => {/* set activeUserCollection */}
};


export const AppContext = createContext(blueprint)