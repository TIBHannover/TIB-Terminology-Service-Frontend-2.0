import { Helmet, HelmetProvider } from 'react-helmet-async';


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
}

export default Toolkit;