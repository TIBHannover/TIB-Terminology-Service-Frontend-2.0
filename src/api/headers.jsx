export function apiHeaders(){
    if(process.env.REACT_APP_PROJECT_ID === "general"){
        let headers ={
            "Accept"       : "application/json",
            "Content-Type" : "application/json",
            'user-agent'   : "TIBCENTRAL",
          };
          return headers
    }
    else if(process.env.REACT_APP_PROJECT_ID === "nfdi4chem"){
        let headers ={
            "Accept"       : "application/json",
            "Content-Type" : "application/json",
            'user-agent'   : "NFDI4CHEM",
          };
          return headers;
    }
    else if(process.env.REACT_APP_PROJECT_ID === "nfdi4ing"){
        let headers ={
            "Accept"       : "application/json",
            "Content-Type" : "application/json",
            'user-agent'   : "NFDI4ING",
          };
          return headers;
    }
}