import { createContext } from "react";

const blueprint = {
    user: null,
    isUserSystemAdmin: false
};


export const AppContext = createContext(blueprint)