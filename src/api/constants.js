const CALL_HEADERS ={
    "Accept"       : "application/json",
    "Content-Type" : "application/json",
    'user-agent'   : process.env.REACT_APP_HEADER_INFO_TIB
};

export const getCallSetting = {method: 'GET',mode: 'cors', headers: CALL_HEADERS};

export const size = 10000;