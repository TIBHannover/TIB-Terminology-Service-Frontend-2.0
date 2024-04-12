import { createContext } from "react";

const blueprint = {
    user: null,
    isUserSystemAdmin: false,
    reportsListForAdmin: []
};


export const AppContext = createContext(blueprint)