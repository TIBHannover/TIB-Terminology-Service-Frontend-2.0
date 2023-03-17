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


    static sortListOfObjectsByKey(objectList, key){
        
    }
}

export default Toolkit;