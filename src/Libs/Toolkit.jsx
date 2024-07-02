import { Helmet, HelmetProvider } from 'react-helmet-async';
import CommonUrlFactory from '../UrlFactory/CommonUrlFactory';


const urlFacory = new CommonUrlFactory();


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
        return objectList.sort(function (a, b) {
            let x = typeof a[key] === "number" ? a[key]: a[key]?.toLowerCase(); 
            let y = typeof b[key] === "number" ? b[key]: b[key]?.toLowerCase(); 
            return (x<y ? sortNumber : (-1 * sortNumber) )
          });        
    }

    
    static transformLinksInStringToAnchor(text){  
        try{    
            if(typeof(text) !== "string"){
                return text;
            }
            let urlRegex = /((https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
            let result = text.replace(urlRegex, (url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            });           
            return result;
        }   
        catch(e){
            return text;
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

 
    static getObjectInListIfExist(list, searchKey, searchValue){
        for(let item of list){
            if (item[searchKey] === searchValue){
                return item;
            }
        }
        return false;
    }



    static getVarInLocalSrorageIfExist(varName, defaultValue){
        return localStorage.getItem(varName) ? localStorage.getItem(varName) : defaultValue;
    }


    static getObsoleteFlagValue(){
        let currentUrlParams = new URL(window.location).searchParams;
        if(!currentUrlParams.get('obsoletes')){
            let obsoleteValue = Toolkit.getVarInLocalSrorageIfExist("obsoletes", "false");
            obsoleteValue = obsoleteValue === "true" ? true : false;
            return Boolean(obsoleteValue);
        }
        let obsoleteValue =  currentUrlParams.get('obsoletes') === "true" ? true : false;
        return obsoleteValue; 
    }


    static setObsoleteInStorageAndUrl(obsoletesValue) {                   
        localStorage.setItem("obsoletes", obsoletesValue);
        document.getElementById("obsoletes-checkbox").checked = obsoletesValue;
        urlFacory.setObsoletes({value:obsoletesValue});
        return true;
    }


    static urlNotEncoded(url) {
        try {          
          const decodedUrl = decodeURIComponent(url);                
          return decodedUrl === url;
        } 
        catch (error) {          
          return false;
        }
    }


    static formatDateTime(datetime){
        // if the time is 00:00:00, then remove it
        if(datetime && typeof(datetime) !== "undefined" && datetime.includes("00:00:00")){
            let date = datetime.split("00:00:00")[0];            
            return date;
        }
        return datetime;
    }


    static getRandomInt(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min
    };

      
}

export default Toolkit;