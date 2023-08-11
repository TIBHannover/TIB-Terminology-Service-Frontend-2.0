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
                let x = typeof a[key] === "number" ? a[parentKey][key]: a[parentKey][key]?.toLowerCase(); 
                let y = typeof b[key] === "number" ? b[parentKey][key]: b[parentKey][key]?.toLowerCase(); 
                return (x<y ? sortNumber : (-1 * sortNumber) )
              });
        }
        else{
            return objectList.sort(function (a, b) {
                let x = typeof a[key] === "number" ? a[key]: a[key]?.toLowerCase(); 
                let y = typeof b[key] === "number" ? b[key]: b[key]?.toLowerCase(); 
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


    static buildHierarchicalArrayFromFlat(flatList, idKeyName, parentKeyName){
        let map = {}; 
        let node = "";
        let roots = [];
        for (let i = 0; i < flatList.length; i++) {
            map[flatList[i][idKeyName]] = i; 
            flatList[i].childrenList = [];
        }        
        for (let i = 0; i < flatList.length; i++) {
            node = flatList[i];
            if (node[parentKeyName] !== "#") {
                flatList[map[node[parentKeyName]]].childrenList.push(node);
            }
            else {
                roots.push(node);
            }
        }
        return roots;
    }

 
    static objectExistInList(list, searchKey, searchValue){
        for(let item of list){
            if (item[searchKey] === searchValue){
                return true
            }
        }
        return false;
    }


    static setParamInUrl(param, newValue){
        let locationObject = window.location;
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set(param, newValue);          
        return locationObject.pathname + "?" +  searchParams.toString();
    }
}

export default Toolkit;