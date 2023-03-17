import { Helmet, HelmetProvider } from 'react-helmet-async';
import React from "react";


class Toolkit{

    static createHelmet(helmetString) {
        return [
            <HelmetProvider>
                <div>
                    <Helmet>                    
                    <title>{helmetString}</title>
                    </Helmet>
                </div>
            </HelmetProvider>
        ];
    }


    static sortListOfObjectsByKey(objectList, key, isReverse=false, parentKey=null){
        let sortNumber = !isReverse ? 1 : -1;
        if(parentKey){
            return objectList.sort(function (a, b) {
                let x = a[parentKey][key]; 
                let y = b[parentKey][key];
                return (x<y ? sortNumber : (-1 * sortNumber) )
              });
        }
        else{
            return objectList.sort(function (a, b) {
                let x = a[key]; 
                let y = b[key];
                return (x<y ? sortNumber : (-1 * sortNumber) )
              });
        }        
    }

    
    static transformStringOfLinksToAnchors(text){  
        if(typeof(text) !== "string"){
            return text;
        }
        let splitedText = text.split("http");
        if (splitedText.length === 1){        
            return text;
        }
        else{
            let result = [];
            text = text.split(",");
            for(let link of text){                
                let anchor = React.createElement("a", {"href": link, "target": "_blank"}, link);      
                result.push(anchor);
                result.push(",  ");
            }
            return result;
        }    
    }
}

export default Toolkit;