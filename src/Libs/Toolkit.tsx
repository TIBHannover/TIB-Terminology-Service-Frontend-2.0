import { Helmet, HelmetProvider } from 'react-helmet-async';
import CommonUrlFactory from '../UrlFactory/CommonUrlFactory';


type GenericObject= {
    [key: string]: any;
}



const urlFacory = new CommonUrlFactory();


class Toolkit{

    static createHelmet(helmetString: string): JSX.Element[] {
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


    static sortListOfObjectsByKey(objectList: Array<GenericObject>, key: string, isReverse:boolean=false, parentKey:string=""){
        let reverseSortSign = !isReverse ? 1 : -1;
        if(parentKey){
            return objectList.sort(function (a:GenericObject, b:GenericObject) {
                let x:number|string = typeof a[key] === "number" ? a[parentKey][key]: a[parentKey][key]?.toLowerCase(); 
                let y:number|string = typeof b[key] === "number" ? b[parentKey][key]: b[parentKey][key]?.toLowerCase(); 
                return (x<y ? reverseSortSign : (-1 * reverseSortSign) )
              });
        }
        return objectList.sort(function (a:GenericObject, b:GenericObject) {
            let x:number|string = typeof a[key] === "number" ? a[key]: a[key]?.toLowerCase(); 
            let y:number|string = typeof b[key] === "number" ? b[key]: b[key]?.toLowerCase(); 
            return (x<y ? reverseSortSign : (-1 * reverseSortSign) )
          });        
    }

    
    static transformLinksInStringToAnchor(text:string){  
        try{    
            if(typeof(text) !== "string"){
                return text;
            }
            let urlRegex = /((https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
            let result = text.replace(urlRegex, (url) => {
                if (url.at(-1) === ","){
                    url = url.slice(0, -1);
                }
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a><br/>`;
            });           
            return result;
        }   
        catch(e){
            return text;
        }           
    }



    static buildHierarchicalArrayFromFlat(flatList:Array<GenericObject>, idKeyName:string, parentKeyName:string){
        type TempMap={
            [key: string]: number;
        }
        let map:TempMap = {}; 
        let node:GenericObject;
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

 
    static getObjectInListIfExist(list:Array<GenericObject>, searchKey:string, searchValue:any){
        for(let item of list){
            if (item[searchKey] === searchValue){
                return item;
            }
        }
        return false;
    }



    static getVarInLocalSrorageIfExist(varName:string, defaultValue:string){
        return localStorage.getItem(varName) ? localStorage.getItem(varName) : defaultValue;
    }


    static getObsoleteFlagValue(){
        let currentUrlParams = new URL(window.location.href).searchParams;
        if(!currentUrlParams.get('obsoletes')){
            let obsoleteValue:any = Toolkit.getVarInLocalSrorageIfExist("obsoletes", "false");
            obsoleteValue = obsoleteValue === "true" ? true : false;
            return Boolean(obsoleteValue);
        }
        let obsoleteValue =  currentUrlParams.get('obsoletes') === "true" ? true : false;
        return obsoleteValue; 
    }

    static setObsoleteInStorageAndUrl(obsoletesValue:boolean|string) {                   
        // @ts-ignore
        localStorage.setItem("obsoletes", obsoletesValue);
        // @ts-ignore
        document.getElementById("obsoletes-checkbox").checked = obsoletesValue;
        urlFacory.setObsoletes({value:obsoletesValue});
        return true;
    }


    static urlNotEncoded(url:string) {
        try {          
          const decodedUrl = decodeURIComponent(url);                
          return decodedUrl === url;
        } 
        catch (error) {          
          return false;
        }
    }


    static formatDateTime(datetime:string|undefined){
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