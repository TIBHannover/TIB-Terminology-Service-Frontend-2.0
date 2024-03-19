import { createContext } from "react";

const blueprint = {
    isUserSystemAdmin: false
};


export const AppContext = createContext(blueprint)